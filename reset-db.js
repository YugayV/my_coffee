const http = require("http");
const https = require("https");
require("dotenv").config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PORT = process.env.PORT || 3000;
const ADMIN_API_BASE_URL =
  process.env.ADMIN_API_BASE_URL || `http://localhost:${PORT}`;

function httpRequest(method, path, body, extraHeaders) {
  return new Promise((resolve, reject) => {
    const url = new URL(ADMIN_API_BASE_URL);
    const isHttps = url.protocol === "https:";
    const data = body ? JSON.stringify(body) : null;

    const options = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path,
      method,
      headers: Object.assign(
        {},
        extraHeaders || {},
        data
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(data)
            }
          : {}
      )
    };

    const client = isHttps ? https : http;
    const req = client.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        let parsed = null;
        if (raw) {
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
        }
        resolve({ status: res.statusCode, data: parsed });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    process.exit(1);
  }

  try {
    console.log("Logging in as admin to", ADMIN_API_BASE_URL);
    const loginRes = await httpRequest("POST", "/api/auth/login-admin", {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (
      !loginRes.status ||
      loginRes.status < 200 ||
      loginRes.status >= 300 ||
      !loginRes.data ||
      !loginRes.data.token
    ) {
      console.error("Admin login failed:", loginRes.status, loginRes.data);
      process.exit(1);
    }

    const token = loginRes.data.token;
    console.log("Admin login OK, resetting database...");

    const resetRes = await httpRequest(
      "POST",
      "/api/admin/reset-db",
      null,
      {
        Authorization: "Bearer " + token
      }
    );

    console.log("Reset response status:", resetRes.status);
    console.log("Reset response body:", resetRes.data);

    if (
      resetRes.status &&
      resetRes.status >= 200 &&
      resetRes.status < 300 &&
      resetRes.data &&
      resetRes.data.ok
    ) {
      console.log("Database reset completed successfully via admin API");
      process.exit(0);
    } else {
      console.error("Database reset failed");
      process.exit(1);
    }
  } catch (err) {
    console.error("Error calling admin reset API:", err);
    process.exit(1);
  }
}

main();
