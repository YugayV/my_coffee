const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const TOSS_SUCCESS_URL = process.env.TOSS_SUCCESS_URL;
const TOSS_FAIL_URL = process.env.TOSS_FAIL_URL;
const ADS_PROVIDER = process.env.ADS_PROVIDER || "local";
const ADSENSE_CLIENT_ID = process.env.ADSENSE_CLIENT_ID;
const ADSENSE_SLOT_ID = process.env.ADSENSE_SLOT_ID;
const KAKAO_AD_UNIT_ID = process.env.KAKAO_AD_UNIT_ID;
const KAKAO_AD_SCRIPT_URL = process.env.KAKAO_AD_SCRIPT_URL;
const NAVER_AD_UNIT_ID = process.env.NAVER_AD_UNIT_ID;
const NAVER_AD_SCRIPT_URL = process.env.NAVER_AD_SCRIPT_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || ADMIN_EMAIL || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI, {
    autoIndex: true
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err.message);
  });

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true, sparse: true },
    kakaoId: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "owner"], default: "user" },
    cityCode: { type: String },
    preferredLang: { type: String, enum: ["ko", "en", "ru"], default: "ko" },
    passwordHash: { type: String },
    marketingOptIn: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isInvestor: { type: Boolean, default: false },
    subscriptionPlan: {
      type: String,
      enum: ["none", "client", "coffee", "invest"],
      default: "none"
    },
    subscriptionExpiresAt: { type: Date }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const adSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    cityCode: String,
    url: String,
    active: { type: Boolean, default: true },
    weight: { type: Number, default: 1 }
  },
  { timestamps: true }
);

const Ad = mongoose.model("Ad", adSchema);

const cafeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    cityCode: { type: String, required: true },
    address: { type: String },
    description: { type: String },
    phone: { type: String },
    openingHours: { type: String },
    averageCheck: { type: Number },
    menu: [
      {
        name: { type: String, required: true },
        price: { type: Number },
        category: { type: String },
        description: { type: String }
      }
    ],
    photos: [
      {
        url: String,
        originalName: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    tables: [
      {
        name: String,
        capacity: Number,
        position: {
          x: Number,
          y: Number
        }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Cafe = mongoose.model("Cafe", cafeSchema);

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: {
      type: String,
      enum: ["client", "coffee", "invest"],
      required: true
    },
    amountWon: { type: Number, required: true },
    currency: { type: String, default: "KRW" },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    provider: { type: String },
    providerPaymentId: { type: String },
    paidAt: { type: Date },
    metadata: { type: Object }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

const cafeSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true }
  },
  { timestamps: true }
);

const CafeSubscription = mongoose.model(
  "CafeSubscription",
  cafeSubscriptionSchema
);

const cafePostSchema = new mongoose.Schema(
  {
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
      }
    ],
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const CafePost = mongoose.model("CafePost", cafePostSchema);

const phoneVerificationSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String },
    channel: {
      type: String,
      enum: ["sms", "email", "kakao", "facebook"],
      default: "sms"
    },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const PhoneVerification = mongoose.model("PhoneVerification", phoneVerificationSchema);

const statsSchema = new mongoose.Schema(
  {
    date: { type: String, unique: true, required: true },
    visits: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Stats = mongoose.model("Stats", statsSchema);

const siteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    contactEmail: { type: String },
    telegramUrl: { type: String },
    instagramUrl: { type: String }
  },
  { timestamps: true }
);

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    lang: { type: String, enum: ["ko", "en", "ru"], default: "ru" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

function callTossPayments(pathname, body) {
  if (!TOSS_SECRET_KEY) {
    return Promise.reject(new Error("toss not configured"));
  }
  const data = JSON.stringify(body);
  const auth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
  const options = {
    hostname: "api.tosspayments.com",
    port: 443,
    path: pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      "Content-Length": Buffer.byteLength(data)
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = raw ? JSON.parse(raw) : {};
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            const err = new Error("toss error");
            err.statusCode = res.statusCode;
            err.body = parsed;
            reject(err);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", (err) => {
      reject(err);
    });
    req.write(data);
    req.end();
  });
}

function normalizePhone(raw) {
  if (!raw) return "";
  let p = String(raw).trim();
  p = p.replace(/[\s\-()]/g, "");
  if (!p) return "";
  if (p.startsWith("+")) {
    return p;
  }
  if (p.startsWith("00") && p.length > 2) {
    return "+" + p.slice(2);
  }
  if (/^0\d{8,}$/.test(p)) {
    return "+82" + p.slice(1);
  }
  if (/^[78]\d{10}$/.test(p)) {
    return "+7" + p.slice(1);
  }
  if (/^\d{10,13}$/.test(p)) {
    return "+" + p;
  }
  return p;
}

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendSms(phone, text) {
  const normalizedPhone = normalizePhone(phone);
  if (
    TWILIO_ACCOUNT_SID &&
    TWILIO_AUTH_TOKEN &&
    TWILIO_FROM_NUMBER &&
    normalizedPhone &&
    text
  ) {
    try {
      const bodyParams = new URLSearchParams();
      bodyParams.append("To", normalizedPhone);
      bodyParams.append("From", TWILIO_FROM_NUMBER);
      bodyParams.append("Body", text);
      const payload = bodyParams.toString();
      const auth = Buffer.from(
        `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
      ).toString("base64");
      const options = {
        hostname: "api.twilio.com",
        port: 443,
        path: `/2010-04-01/Accounts/${encodeURIComponent(
          TWILIO_ACCOUNT_SID
        )}/Messages.json`,
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(payload)
        }
      };
      await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          res.on("data", () => {});
          res.on("end", () => resolve());
        });
        req.on("error", (err) => {
          console.error("twilio sms error", err.message);
          resolve();
        });
        req.write(payload);
        req.end();
      });
      return;
    } catch (err) {
      console.error("twilio sms unexpected error", err.message);
    }
  }
  console.log("SMS to", normalizedPhone || phone, text);
}

async function sendEmail(to, subject, text) {
  if (!to || !subject || !text) {
    return;
  }
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM_EMAIL) {
    try {
      const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      });
      await transport.sendMail({
        from: SMTP_FROM_EMAIL,
        to,
        subject,
        text
      });
      return;
    } catch (err) {
      console.error("smtp email error", err.message);
    }
  }
  console.log("EMAIL to", to, subject, text);
}

async function sendFacebook(recipient, text) {
  if (!recipient || !text) {
    return;
  }
  console.log("FACEBOOK message to", recipient, text);
}

async function registerVisit() {
  try {
    const now = new Date();
    const key = now.toISOString().slice(0, 10);
    await Stats.findOneAndUpdate(
      { date: key },
      { $inc: { visits: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (e) {
  }
}

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${safeBase}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return cb(new Error("only image uploads allowed"));
    }
    cb(null, true);
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20
});

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const proto = req.headers["x-forwarded-proto"];
    if (proto && proto !== "https") {
      const host = req.headers.host;
      if (host) {
        return res.redirect(301, `https://${host}${req.originalUrl}`);
      }
    }
  }
  next();
});

app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, "public")));

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "no auth header" });
  }
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "invalid auth header" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
}

function ownerOnly(req, res, next) {
  if (!req.user || req.user.role !== "owner") {
    return res.status(403).json({ error: "owner role required" });
  }
  next();
}

function adminOnly(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "admin role required" });
  }
  next();
}

app.get("/", async (req, res) => {
  await registerVisit();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/cafe/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/payments/toss/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/payments/toss/fail", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/owner", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "owner.html"));
});

app.post("/api/auth/request-phone-code", authLimiter, async (req, res) => {
  try {
    const { phone, email, channel } = req.body;
    const requestedChannel =
      typeof channel === "string" && channel.trim()
        ? channel.trim().toLowerCase()
        : "sms";
    const isProd = process.env.NODE_ENV === "production";
    if (requestedChannel === "email") {
      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "email required" });
      }
      const trimmedEmail = email.trim().toLowerCase();
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await PhoneVerification.findOneAndUpdate(
        { email: trimmedEmail, channel: "email" },
        { code, expiresAt, attempts: 0 },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      const hasSmtp =
        SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM_EMAIL;
      await sendEmail(
        trimmedEmail,
        "Kafe Booking verification code",
        "Ваш код для Kafe Booking: " + code
      );
      const payload = { ok: true };
      if (!hasSmtp && !isProd) {
        payload.devCode = code;
      }
      return res.json(payload);
    }
    if (!phone) {
      return res.status(400).json({ error: "phone required" });
    }
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ error: "invalid phone" });
    }
    const channelValue =
      requestedChannel === "kakao" || requestedChannel === "facebook"
        ? requestedChannel
        : "sms";
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await PhoneVerification.findOneAndUpdate(
      { phone: normalizedPhone, channel: channelValue },
      { code, expiresAt, attempts: 0 },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const hasTwilio =
      TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER;
    if (channelValue === "facebook") {
      await sendFacebook(normalizedPhone, "Ваш код для Kafe Booking: " + code);
    } else {
      await sendSms(normalizedPhone, "Ваш код для Kafe Booking: " + code);
    }
    const payload = { ok: true };
    if (!hasTwilio && !isProd) {
      payload.devCode = code;
    }
    res.json(payload);
  } catch (err) {
    console.error("request-phone-code error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/auth/register-phone", authLimiter, async (req, res) => {
  try {
    const {
      phone,
      email,
      password,
      name,
      role,
      cityCode,
      preferredLang,
      marketingOptIn
    } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "email, password and name required" });
    }
    const trimmedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      return res.status(400).json({ error: "invalid email" });
    }
    let normalizedPhone = "";
    if (phone) {
      normalizedPhone = normalizePhone(phone);
      if (!normalizedPhone) {
        return res.status(400).json({ error: "invalid phone" });
      }
    }
    if (normalizedPhone) {
      const existingByPhone = await User.findOne({ phone: normalizedPhone });
      if (existingByPhone) {
        return res.status(409).json({ error: "user already exists" });
      }
    }
    const existingByEmail = await User.findOne({ email: trimmedEmail });
    if (existingByEmail) {
      return res.status(409).json({ error: "user already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      phone: normalizedPhone || undefined,
      email: trimmedEmail,
      passwordHash: hash,
      name,
      role: role === "owner" ? "owner" : "user",
      cityCode: cityCode || null,
      preferredLang: preferredLang || "ko",
      marketingOptIn: !!marketingOptIn
    });
    const tokenPayload = {
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin,
      subscriptionPlan: user.subscriptionPlan
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
        cityCode: user.cityCode,
        preferredLang: user.preferredLang,
        isAdmin: user.isAdmin,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (err) {
    console.error("register-phone error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/auth/login-admin", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.status(500).json({ error: "admin login not configured" });
    }
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    let user = await User.findOne({ email: ADMIN_EMAIL });
    if (!user) {
      user = await User.create({
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "owner",
        preferredLang: "ko",
        isAdmin: true
      });
    } else if (!user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }
    const tokenPayload = {
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin,
      subscriptionPlan: user.subscriptionPlan
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        kakaoId: user.kakaoId,
        email: user.email,
        name: user.name,
        role: user.role,
        cityCode: user.cityCode,
        preferredLang: user.preferredLang,
        isAdmin: user.isAdmin,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (err) {
    console.error("login-admin error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: "login and password required" });
    }
    let user = null;
    const rawLogin = String(login).trim();
    if (rawLogin.includes("@")) {
      const email = rawLogin.toLowerCase();
      user = await User.findOne({ email });
    }
    if (!user) {
      const normalizedPhone = normalizePhone(rawLogin);
      if (normalizedPhone) {
        user = await User.findOne({ phone: normalizedPhone });
      }
    }
    if (!user) {
      user = await User.findOne({ name: rawLogin });
    }
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    const tokenPayload = {
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin,
      subscriptionPlan: user.subscriptionPlan
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        kakaoId: user.kakaoId,
        email: user.email,
        name: user.name,
        role: user.role,
        cityCode: user.cityCode,
        preferredLang: user.preferredLang,
        isAdmin: user.isAdmin,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/auth/login-phone", authLimiter, async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "phone and password required" });
    }
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ error: "invalid phone" });
    }
    const user = await User.findOne({ phone: normalizedPhone });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "invalid credentials" });
    }
    const tokenPayload = {
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin,
      subscriptionPlan: user.subscriptionPlan
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        cityCode: user.cityCode,
        preferredLang: user.preferredLang,
        isAdmin: user.isAdmin,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (err) {
    console.error("login-phone error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/auth/login-kakao", authLimiter, async (req, res) => {
  try {
    const { kakaoId, email, name } = req.body;
    if (!kakaoId) {
      return res.status(400).json({ error: "kakaoId required" });
    }
    const kakaoIdStr = String(kakaoId);
    let user =
      (await User.findOne({ kakaoId: kakaoIdStr })) ||
      (email ? await User.findOne({ email }) : null);
    if (!user) {
      const userDoc = await User.create({
        kakaoId: kakaoIdStr,
        email: email || undefined,
        name: name || "Kakao user",
        role: "user",
        preferredLang: "ko"
      });
      user = userDoc;
    } else {
      let changed = false;
      if (!user.kakaoId) {
        user.kakaoId = kakaoIdStr;
        changed = true;
      }
      if (email && !user.email) {
        user.email = email;
        changed = true;
      }
      if (name && !user.name) {
        user.name = name;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }
    const tokenPayload = {
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin,
      subscriptionPlan: user.subscriptionPlan
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        kakaoId: user.kakaoId,
        email: user.email,
        name: user.name,
        role: user.role,
        cityCode: user.cityCode,
        preferredLang: user.preferredLang,
        isAdmin: user.isAdmin,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (err) {
    console.error("login-kakao error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/profile/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("phone name role cityCode preferredLang marketingOptIn isAdmin isInvestor subscriptionPlan subscriptionExpiresAt")
      .lean();
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("profile-me error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/profile/update", authMiddleware, async (req, res) => {
  try {
    const { preferredLang, cityCode, currentPassword, newPassword } = req.body || {};
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    let changed = false;

    if (typeof preferredLang !== "undefined") {
      const allowedLangs = ["ko", "en", "ru"];
      if (!preferredLang || !allowedLangs.includes(preferredLang)) {
        return res.status(400).json({ error: "invalid-lang" });
      }
      if (user.preferredLang !== preferredLang) {
        user.preferredLang = preferredLang;
        changed = true;
      }
    }

    if (typeof cityCode === "string" && cityCode.trim()) {
      if (user.cityCode !== cityCode) {
        user.cityCode = cityCode;
        changed = true;
      }
    }

    const hasCurrentPassword = typeof currentPassword === "string" && currentPassword;
    const hasNewPassword = typeof newPassword === "string" && newPassword;

    if (hasCurrentPassword !== hasNewPassword) {
      return res.status(400).json({ error: "password-fields-required" });
    }

    if (hasCurrentPassword && hasNewPassword) {
      if (!user.passwordHash) {
        return res.status(400).json({ error: "password-not-set" });
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({ error: "password-too-short" });
      }
      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) {
        return res.status(400).json({ error: "invalid-current-password" });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
      changed = true;
    }

    if (changed) {
      await user.save();
    }

    res.json({
      user: {
        id: user._id,
        phone: user.phone,
        kakaoId: user.kakaoId,
        email: user.email,
        name: user.name,
        role: user.role,
        cityCode: user.cityCode,
        preferredLang: user.preferredLang,
        isAdmin: user.isAdmin,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (err) {
    console.error("profile-update error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/cafes/:id/subscribe", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const cafe = await Cafe.findById(id).select("_id isActive").lean();
    if (!cafe || !cafe.isActive) {
      return res.status(404).json({ error: "cafe not found" });
    }
    const existing = await CafeSubscription.findOne({
      user: req.user.id,
      cafe: cafe._id
    }).lean();
    if (existing) {
      await CafeSubscription.deleteOne({ _id: existing._id });
      return res.json({ subscribed: false });
    }
    await CafeSubscription.create({
      user: req.user.id,
      cafe: cafe._id
    });
    res.json({ subscribed: true });
  } catch (err) {
    console.error("cafe subscribe error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/cafes/:id/subscribers", async (req, res) => {
  try {
    const { id } = req.params;
    const cafe = await Cafe.findById(id).select("_id isActive").lean();
    if (!cafe || !cafe.isActive) {
      return res.status(404).json({ error: "cafe not found" });
    }
    const count = await CafeSubscription.countDocuments({ cafe: cafe._id });
    res.json({ count });
  } catch (err) {
    console.error("cafe subscribers error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/my/subscriptions", authMiddleware, async (req, res) => {
  try {
    const subscriptions = await CafeSubscription.find({
      user: req.user.id
    })
      .select("cafe createdAt")
      .populate("cafe", "name cityCode address")
      .lean();
    res.json({ subscriptions });
  } catch (err) {
    console.error("my subscriptions error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/cafes/:id/posts", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text required" });
    }
    const cafe = await Cafe.findOne({ _id: id, owner: req.user.id })
      .select("_id isActive")
      .lean();
    if (!cafe || !cafe.isActive) {
      return res.status(404).json({ error: "cafe not found" });
    }
    const post = await CafePost.create({
      cafe: cafe._id,
      author: req.user.id,
      text: text.trim()
    });
    res.status(201).json({ post });
  } catch (err) {
    console.error("create cafe post error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/cafes/:id/posts", async (req, res) => {
  try {
    const { id } = req.params;
    const limitRaw = req.query.limit;
    const offsetRaw = req.query.offset;
    let limit = Number(limitRaw);
    let offset = Number(offsetRaw);
    if (!Number.isFinite(limit) || limit <= 0) {
      limit = 10;
    }
    if (!Number.isFinite(offset) || offset < 0) {
      offset = 0;
    }
    if (limit > 50) {
      limit = 50;
    }
    const cafe = await Cafe.findById(id).select("_id isActive").lean();
    if (!cafe || !cafe.isActive) {
      return res.status(404).json({ error: "cafe not found" });
    }
    const rawPosts = await CafePost.find({ cafe: cafe._id })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit + 1)
      .lean();
    const hasMore = rawPosts.length > limit;
    const slice = hasMore ? rawPosts.slice(0, limit) : rawPosts;
    const normalized = slice.map((p) => {
      const likesCount = Array.isArray(p.likes) ? p.likes.length : 0;
      const ratingCount =
        typeof p.ratingCount === "number" && p.ratingCount > 0
          ? p.ratingCount
          : 0;
      const ratingSum =
        typeof p.ratingSum === "number" && p.ratingSum > 0 ? p.ratingSum : 0;
      const rating =
        ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(2)) : 0;
      return {
        _id: p._id,
        cafe: p.cafe,
        author: p.author,
        text: p.text,
        createdAt: p.createdAt,
        likesCount,
        rating,
        comments: Array.isArray(p.comments) ? p.comments : []
      };
    });
    res.json({ posts: normalized, hasMore, limit, offset });
  } catch (err) {
    console.error("list cafe posts error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post(
  "/api/cafes/:cafeId/posts/:postId/like",
  authMiddleware,
  async (req, res) => {
    try {
      const { cafeId, postId } = req.params;
      const post = await CafePost.findOne({
        _id: postId,
        cafe: cafeId
      });
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }
      const userId = String(req.user.id);
      const likes = Array.isArray(post.likes) ? post.likes : [];
      const exists = likes.some((l) => String(l.user) === userId);
      if (exists) {
        post.likes = likes.filter((l) => String(l.user) !== userId);
      } else {
        post.likes.push({ user: req.user.id });
      }
      await post.save();
      res.json({ ok: true });
    } catch (err) {
      console.error("post like error", err);
      res.status(500).json({ error: "server error" });
    }
  }
);

app.post(
  "/api/cafes/:cafeId/posts/:postId/comment",
  authMiddleware,
  async (req, res) => {
    try {
      const { cafeId, postId } = req.params;
      const { text } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "text required" });
      }
      const post = await CafePost.findOne({
        _id: postId,
        cafe: cafeId
      });
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }
      post.comments = Array.isArray(post.comments) ? post.comments : [];
      post.comments.push({
        user: req.user.id,
        text: text.trim(),
        createdAt: new Date()
      });
      await post.save();
      res.json({ ok: true });
    } catch (err) {
      console.error("post comment error", err);
      res.status(500).json({ error: "server error" });
    }
  }
);

app.post(
  "/api/cafes/:cafeId/posts/:postId/rate",
  authMiddleware,
  async (req, res) => {
    try {
      const { cafeId, postId } = req.params;
      const { rating } = req.body;
      const value = Number(rating);
      if (!Number.isFinite(value) || value < 1 || value > 5) {
        return res.status(400).json({ error: "rating must be 1-5" });
      }
      const post = await CafePost.findOne({
        _id: postId,
        cafe: cafeId
      });
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }
      post.ratingSum =
        (typeof post.ratingSum === "number" ? post.ratingSum : 0) + value;
      post.ratingCount =
        (typeof post.ratingCount === "number" ? post.ratingCount : 0) + 1;
      await post.save();
      res.json({ ok: true });
    } catch (err) {
      console.error("post rate error", err);
      res.status(500).json({ error: "server error" });
    }
  }
);

app.post("/api/profile/become-owner", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    if (user.role !== "owner") {
      user.role = "owner";
      await user.save();
    }
    const tokenPayload = {
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin,
      subscriptionPlan: user.subscriptionPlan
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        cityCode: user.cityCode,
        preferredLang: user.preferredLang,
        isAdmin: user.isAdmin,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (err) {
    console.error("profile-become-owner error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/ads", async (req, res) => {
  try {
    const { city } = req.query;
    const cityCode = city || null;
    const query = { active: true };
    let hideAds = false;
    const header = req.headers.authorization;
    if (header) {
      const [type, token] = header.split(" ");
      if (type === "Bearer" && token) {
        try {
          const payload = jwt.verify(token, JWT_SECRET);
          if (payload.subscriptionPlan === "client" || payload.subscriptionPlan === "coffee") {
            hideAds = true;
          }
        } catch (e) {}
      }
    }
    if (hideAds) {
      return res.json({ ads: [] });
    }
    if (cityCode) {
      query.cityCode = { $in: [cityCode, "all"] };
    }
    const ads = await Ad.find(query).sort({ weight: -1, createdAt: -1 }).limit(5).lean();
    res.json({ ads });
  } catch (err) {
    console.error("ads error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/ads/config", async (req, res) => {
  try {
    let showAds = true;
    const header = req.headers.authorization;
    if (header) {
      const parts = header.split(" ");
      if (parts[0] === "Bearer" && parts[1]) {
        try {
          const payload = jwt.verify(parts[1], JWT_SECRET);
          if (payload.subscriptionPlan === "client" || payload.subscriptionPlan === "coffee") {
            showAds = false;
          }
        } catch (e) {}
      }
    }
    if (!showAds) {
      return res.json({
        showAds: false,
        provider: ADS_PROVIDER || "local"
      });
    }
    let provider = ADS_PROVIDER || "local";
    if (req.query.provider && typeof req.query.provider === "string") {
      const p = req.query.provider.toLowerCase();
      if (p === "adsense" || p === "kakao" || p === "naver" || p === "local") {
        provider = p;
      }
    }
    if (provider === "adsense" && ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID) {
      return res.json({
        showAds: true,
        provider: "adsense",
        adsenseClientId: ADSENSE_CLIENT_ID,
        adsenseSlotId: ADSENSE_SLOT_ID
      });
    }
    if (provider === "kakao" && KAKAO_AD_UNIT_ID && KAKAO_AD_SCRIPT_URL) {
      return res.json({
        showAds: true,
        provider: "kakao",
        kakaoUnitId: KAKAO_AD_UNIT_ID,
        kakaoScriptUrl: KAKAO_AD_SCRIPT_URL
      });
    }
    if (provider === "naver" && NAVER_AD_UNIT_ID && NAVER_AD_SCRIPT_URL) {
      return res.json({
        showAds: true,
        provider: "naver",
        naverUnitId: NAVER_AD_UNIT_ID,
        naverScriptUrl: NAVER_AD_SCRIPT_URL
      });
    }
    res.json({
      showAds: true,
      provider: "local"
    });
  } catch (err) {
    console.error("ads-config error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/stats/visits", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const todayDoc = await Stats.findOne({ date: today }).lean();
    const agg = await Stats.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$visits" }
        }
      }
    ]);
    const totalVisits = agg.length ? agg[0].total : 0;
    const dailyVisits = todayDoc ? todayDoc.visits : 0;
    res.json({ totalVisits, dailyVisits });
  } catch (err) {
    console.error("stats-visits error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/site-config", async (req, res) => {
  try {
    const cfg = await SiteConfig.findOne({ key: "default" }).lean();
    res.json({
      contactEmail: (cfg && cfg.contactEmail) || ADMIN_EMAIL || "",
      telegramUrl: cfg && cfg.telegramUrl ? cfg.telegramUrl : "",
      instagramUrl: cfg && cfg.instagramUrl ? cfg.instagramUrl : ""
    });
  } catch (err) {
    console.error("site-config error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const lang =
      typeof req.query.lang === "string" && req.query.lang.trim()
        ? req.query.lang.trim()
        : null;
    const query = { isActive: true };
    if (lang) {
      query.$or = [{ lang }, { lang: { $exists: false } }, { lang: "" }];
    }
    const items = await News.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json({ news: items });
  } catch (err) {
    console.error("news list error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.put("/api/admin/site-config", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { contactEmail, telegramUrl, instagramUrl } = req.body;
    const update = {};
    if (contactEmail !== undefined) update.contactEmail = contactEmail;
    if (telegramUrl !== undefined) update.telegramUrl = telegramUrl;
    if (instagramUrl !== undefined) update.instagramUrl = instagramUrl;
    const cfg = await SiteConfig.findOneAndUpdate(
      { key: "default" },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({
      contactEmail: cfg.contactEmail || "",
      telegramUrl: cfg.telegramUrl || "",
      instagramUrl: cfg.instagramUrl || ""
    });
  } catch (err) {
    console.error("admin-site-config error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/admin/news", authMiddleware, adminOnly, async (req, res) => {
  try {
    const items = await News.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.json({ news: items });
  } catch (err) {
    console.error("admin news list error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/admin/verifications", authMiddleware, adminOnly, async (req, res) => {
  try {
    const items = await PhoneVerification.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json({ verifications: items });
  } catch (err) {
    console.error("admin verifications list error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.delete(
  "/api/admin/verifications/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await PhoneVerification.findById(id);
      if (!doc) {
        return res.status(404).json({ error: "verification not found" });
      }
      await doc.deleteOne();
      res.json({ ok: true });
    } catch (err) {
      console.error("admin verifications delete error", err);
      res.status(500).json({ error: "server error" });
    }
  }
);

app.post("/api/admin/news", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, text, lang, isActive } = req.body;
    if (!title || !text) {
      return res.status(400).json({ error: "title and text required" });
    }
    const doc = await News.create({
      title,
      text,
      lang: lang && typeof lang === "string" ? lang : "ru",
      isActive: isActive !== undefined ? !!isActive : true
    });
    res.status(201).json({ news: doc });
  } catch (err) {
    console.error("admin news create error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.patch("/api/admin/news/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, lang, isActive } = req.body;
    const doc = await News.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "news not found" });
    }
    if (title !== undefined) {
      doc.title = title;
    }
    if (text !== undefined) {
      doc.text = text;
    }
    if (lang !== undefined && typeof lang === "string" && lang) {
      doc.lang = lang;
    }
    if (isActive !== undefined) {
      doc.isActive = !!isActive;
    }
    await doc.save();
    res.json({ news: doc });
  } catch (err) {
    console.error("admin news update error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.delete("/api/admin/news/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await News.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "news not found" });
    }
    await doc.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error("admin news delete error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/payments/subscribe", authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan || !["client", "coffee", "invest"].includes(plan)) {
      return res.status(400).json({ error: "invalid plan" });
    }
    let amountWon = 0;
    if (plan === "client") {
      amountWon = 2000;
    } else if (plan === "coffee") {
      amountWon = 25000;
    } else if (plan === "invest") {
      amountWon = 0;
    }
    const payment = await Payment.create({
      user: req.user.id,
      plan,
      amountWon,
      currency: "KRW",
      status: "pending"
    });
    if (
      plan === "invest" ||
      !TOSS_SECRET_KEY ||
      !TOSS_SUCCESS_URL ||
      !TOSS_FAIL_URL ||
      amountWon <= 0
    ) {
      return res.status(201).json({
        payment: {
          id: payment._id,
          plan: payment.plan,
          amountWon: payment.amountWon,
          currency: payment.currency,
          status: payment.status
        }
      });
    }
    const orderId = `payment_${payment._id.toString()}`;
    const orderName =
      plan === "coffee" ? "Coffee Premium" : "Client Premium";
    const tossBody = {
      amount: amountWon,
      orderId,
      orderName,
      successUrl: TOSS_SUCCESS_URL,
      failUrl: TOSS_FAIL_URL
    };
    const tossPayment = await callTossPayments("/v1/payments", tossBody);
    const checkoutUrl =
      tossPayment &&
      tossPayment.checkout &&
      typeof tossPayment.checkout.url === "string"
        ? tossPayment.checkout.url
        : null;
    payment.provider = "toss";
    payment.metadata = Object.assign({}, payment.metadata || {}, {
      orderId: tossPayment && tossPayment.orderId ? tossPayment.orderId : orderId,
      checkoutUrl
    });
    await payment.save();
    res.status(201).json({
      payment: {
        id: payment._id,
        plan: payment.plan,
        amountWon: payment.amountWon,
        currency: payment.currency,
        status: payment.status
      },
      checkoutUrl,
      orderId: tossPayment && tossPayment.orderId ? tossPayment.orderId : orderId
    });
  } catch (err) {
    console.error("subscribe error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/payments/toss/confirm", authMiddleware, async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body;
    if (!paymentKey || !orderId || typeof amount !== "number") {
      return res
        .status(400)
        .json({ error: "paymentKey, orderId, amount required" });
    }
    if (!TOSS_SECRET_KEY) {
      return res.status(500).json({ error: "toss not configured" });
    }
    const confirmBody = {
      paymentKey,
      orderId,
      amount
    };
    const tossResult = await callTossPayments(
      "/v1/payments/confirm",
      confirmBody
    );
    let paymentId = null;
    if (orderId.startsWith("payment_")) {
      paymentId = orderId.slice("payment_".length);
    }
    const payment = paymentId ? await Payment.findById(paymentId) : null;
    if (!payment) {
      return res.status(404).json({ error: "payment not found" });
    }
    payment.status = "paid";
    payment.paidAt = new Date();
    payment.provider = "toss";
    payment.providerPaymentId = paymentKey;
    payment.metadata = Object.assign({}, payment.metadata || {}, {
      tossPaymentKey: paymentKey,
      tossOrderId: orderId,
      tossResult
    });
    await payment.save();
    const user = await User.findById(payment.user);
    if (user) {
      const now = new Date();
      const current =
        user.subscriptionExpiresAt && user.subscriptionExpiresAt > now
          ? user.subscriptionExpiresAt
          : now;
      const next = new Date(current.getTime() + 30 * 24 * 60 * 60 * 1000);
      user.subscriptionPlan = payment.plan;
      user.subscriptionExpiresAt = next;
      await user.save();
    }
    res.json({
      payment: {
        id: payment._id,
        plan: payment.plan,
        amountWon: payment.amountWon,
        currency: payment.currency,
        status: payment.status,
        provider: payment.provider
      }
    });
  } catch (err) {
    console.error("toss confirm error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/admin/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({})
      .select(
        "phone kakaoId email name role cityCode preferredLang marketingOptIn isAdmin isInvestor subscriptionPlan subscriptionExpiresAt createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();
    res.json({ users });
  } catch (err) {
    console.error("admin users list error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.patch(
  "/api/admin/users/:id/subscription",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        subscriptionPlan,
        subscriptionExpiresAt,
        isAdmin,
        isInvestor
      } = req.body;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      if (subscriptionPlan !== undefined) {
        const allowedPlans = ["none", "client", "coffee", "invest"];
        if (!allowedPlans.includes(subscriptionPlan)) {
          return res.status(400).json({ error: "invalid subscriptionPlan" });
        }
        user.subscriptionPlan = subscriptionPlan;
      }
      if (subscriptionExpiresAt !== undefined) {
        if (subscriptionExpiresAt === null || subscriptionExpiresAt === "") {
          user.subscriptionExpiresAt = null;
        } else {
          const date = new Date(subscriptionExpiresAt);
          if (Number.isNaN(date.getTime())) {
            return res
              .status(400)
              .json({ error: "invalid subscriptionExpiresAt" });
          }
          user.subscriptionExpiresAt = date;
        }
      }
      if (isAdmin !== undefined) {
        user.isAdmin = !!isAdmin;
      }
      if (isInvestor !== undefined) {
        user.isInvestor = !!isInvestor;
      }
      await user.save();
      res.json({
        user: {
          id: user._id,
          phone: user.phone,
          kakaoId: user.kakaoId,
          email: user.email,
          name: user.name,
          role: user.role,
          cityCode: user.cityCode,
          preferredLang: user.preferredLang,
          marketingOptIn: user.marketingOptIn,
          isAdmin: user.isAdmin,
          isInvestor: user.isInvestor,
          subscriptionPlan: user.subscriptionPlan,
          subscriptionExpiresAt: user.subscriptionExpiresAt
        }
      });
    } catch (err) {
      console.error("admin user subscription update error", err);
      res.status(500).json({ error: "server error" });
    }
  }
);

app.get("/api/admin/cafes", authMiddleware, adminOnly, async (req, res) => {
  try {
    const cafes = await Cafe.find({})
      .populate({
        path: "owner",
        select:
          "phone kakaoId email name role cityCode preferredLang isAdmin isInvestor"
      })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ cafes });
  } catch (err) {
    console.error("admin cafes list error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.patch(
  "/api/admin/cafes/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const cafe = await Cafe.findById(id);
      if (!cafe) {
        return res.status(404).json({ error: "cafe not found" });
      }
      if (isActive !== undefined) {
        cafe.isActive = !!isActive;
      }
      await cafe.save();
      res.json({ cafe });
    } catch (err) {
      console.error("admin cafe update error", err);
      res.status(500).json({ error: "server error" });
    }
  }
);

app.get("/api/admin/ads", authMiddleware, adminOnly, async (req, res) => {
  try {
    const ads = await Ad.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.json({ ads });
  } catch (err) {
    console.error("admin ads list error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/api/admin/ads", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, text, cityCode, url, active, weight } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title required" });
    }
    const ad = await Ad.create({
      title,
      text: text || "",
      cityCode: cityCode || "all",
      url: url || "",
      active: active !== undefined ? !!active : true,
      weight:
        typeof weight === "number" && Number.isFinite(weight) ? weight : 1
    });
    res.status(201).json({ ad });
  } catch (err) {
    console.error("admin ad create error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.patch("/api/admin/ads/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, cityCode, url, active, weight } = req.body;
    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({ error: "ad not found" });
    }
    if (title !== undefined) {
      ad.title = title;
    }
    if (text !== undefined) {
      ad.text = text;
    }
    if (cityCode !== undefined) {
      ad.cityCode = cityCode;
    }
    if (url !== undefined) {
      ad.url = url;
    }
    if (active !== undefined) {
      ad.active = !!active;
    }
    if (weight !== undefined) {
      if (typeof weight === "number" && Number.isFinite(weight)) {
        ad.weight = weight;
      }
    }
    await ad.save();
    res.json({ ad });
  } catch (err) {
    console.error("admin ad update error", err);
    res.status(500).json({ error: "server error" });
  }
});
app.post("/api/cafes", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const {
      name,
      cityCode,
      address,
      description,
      phone,
      openingHours,
      averageCheck,
      tables,
      menu
    } = req.body;
    if (!name || !cityCode) {
      return res.status(400).json({ error: "name and cityCode required" });
    }
    const cafe = await Cafe.create({
      owner: req.user.id,
      name,
      cityCode,
      address: address || "",
      description: description || "",
      phone: phone || "",
      openingHours: openingHours || "",
      averageCheck:
        typeof averageCheck === "number"
          ? averageCheck
          : Number(averageCheck) || 0,
      tables: Array.isArray(tables) ? tables : [],
      menu: Array.isArray(menu) ? menu : []
    });
    res.status(201).json({ cafe });
  } catch (err) {
    console.error("create cafe error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/my/cafes", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const cafes = await Cafe.find({ owner: req.user.id })
      .select(
        "name cityCode address description phone openingHours averageCheck isActive photos createdAt menu"
      )
      .sort({ createdAt: -1 })
      .lean();
    res.json({ cafes });
  } catch (err) {
    console.error("my-cafes error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.put("/api/cafes/:id", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      cityCode,
      address,
      description,
      phone,
      openingHours,
      averageCheck,
      tables,
      menu,
      isActive
    } = req.body;
    const cafe = await Cafe.findOne({ _id: id, owner: req.user.id });
    if (!cafe) {
      return res.status(404).json({ error: "cafe not found" });
    }
    if (name !== undefined) cafe.name = name;
    if (cityCode !== undefined) cafe.cityCode = cityCode;
    if (address !== undefined) cafe.address = address;
    if (description !== undefined) cafe.description = description;
    if (phone !== undefined) cafe.phone = phone;
    if (openingHours !== undefined) cafe.openingHours = openingHours;
    if (averageCheck !== undefined) {
      const numeric =
        typeof averageCheck === "number"
          ? averageCheck
          : Number(averageCheck);
      cafe.averageCheck = Number.isFinite(numeric) ? numeric : 0;
    }
    if (tables !== undefined && Array.isArray(tables)) cafe.tables = tables;
    if (menu !== undefined && Array.isArray(menu)) cafe.menu = menu;
    if (isActive !== undefined) cafe.isActive = !!isActive;
    await cafe.save();
    res.json({ cafe });
  } catch (err) {
    console.error("update cafe error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/api/cafes", async (req, res) => {
  try {
    const { city, id } = req.query;
    if (id) {
      const cafe = await Cafe.findOne({ _id: id, isActive: true })
        .select("name cityCode address description phone openingHours averageCheck photos menu")
        .lean();
      if (!cafe) {
        return res.status(404).json({ error: "cafe not found" });
      }
      return res.json({ cafe });
    }
    const query = { isActive: true };
    if (city) {
      query.cityCode = city;
    }
    const cafes = await Cafe.find(query)
      .select("name cityCode address description phone openingHours averageCheck photos menu")
      .sort({ createdAt: -1 })
      .lean();
    const cafeIds = cafes.map((c) => c._id);
    let countsByCafe = {};
    if (cafeIds.length) {
      const counts = await CafeSubscription.aggregate([
        { $match: { cafe: { $in: cafeIds } } },
        {
          $group: {
            _id: "$cafe",
            count: { $sum: 1 }
          }
        }
      ]);
      countsByCafe = counts.reduce((acc, item) => {
        acc[String(item._id)] = item.count;
        return acc;
      }, {});
    }
    const cafesWithCounts = cafes.map((cafe) => {
      const id = String(cafe._id);
      return {
        ...cafe,
        subscribersCount:
          typeof countsByCafe[id] === "number" ? countsByCafe[id] : 0
      };
    });
    res.json({ cafes: cafesWithCounts });
  } catch (err) {
    console.error("list cafes error", err);
    res.status(500).json({ error: "server error" });
  }
});

app.post(
  "/api/cafes/:id/photos",
  authMiddleware,
  ownerOnly,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ error: "photo file required" });
      }
      const cafe = await Cafe.findOne({ _id: id, owner: req.user.id });
      if (!cafe) {
        return res.status(404).json({ error: "cafe not found" });
      }
      const publicUrl = `/uploads/${req.file.filename}`;
      cafe.photos.push({
        url: publicUrl,
        originalName: req.file.originalname
      });
      await cafe.save();
      res.status(201).json({ photos: cafe.photos });
    } catch (err) {
      console.error("upload cafe photo error", err);
      res.status(500).json({ error: "server error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
