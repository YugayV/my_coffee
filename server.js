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

const upload = multer({ storage });

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/payments/toss/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/payments/toss/fail", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/auth/register-phone", authLimiter, async (req, res) => {
  try {
    const { phone, password, name, role, cityCode, preferredLang, marketingOptIn } = req.body;
    if (!phone || !password || !name) {
      return res.status(400).json({ error: "phone, password, name required" });
    }
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(409).json({ error: "user already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      phone,
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

app.post("/api/auth/login-phone", authLimiter, async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "phone and password required" });
    }
    const user = await User.findOne({ phone });
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
  // список пользователей с ролями и тарифами
});

app.patch("/api/admin/users/:id/subscription", authMiddleware, adminOnly, async (req, res) => {
  // изменение subscriptionPlan, subscriptionExpiresAt, isAdmin, isInvestor
});

app.get("/api/admin/cafes", authMiddleware, adminOnly, async (req, res) => {
  // список всех кафе
});

app.patch("/api/admin/cafes/:id", authMiddleware, adminOnly, async (req, res) => {
  // включить/выключить кафе (isActive)
});

app.get("/api/admin/ads", authMiddleware, adminOnly, async (req, res) => {
  // список рекламных блоков
});

app.post("/api/admin/ads", authMiddleware, adminOnly, async (req, res) => {
  // создание рекламного блока
});

app.patch("/api/admin/ads/:id", authMiddleware, adminOnly, async (req, res) => {
  // правка рекламного блока
});
app.post("/api/cafes", authMiddleware, ownerOnly, async (req, res) => {
  try {
    const { name, cityCode, address, description, phone, tables } = req.body;
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
      tables: Array.isArray(tables) ? tables : []
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
      .select("name cityCode address description phone isActive photos createdAt")
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
    const { name, cityCode, address, description, phone, tables, isActive } = req.body;
    const cafe = await Cafe.findOne({ _id: id, owner: req.user.id });
    if (!cafe) {
      return res.status(404).json({ error: "cafe not found" });
    }
    if (name !== undefined) cafe.name = name;
    if (cityCode !== undefined) cafe.cityCode = cityCode;
    if (address !== undefined) cafe.address = address;
    if (description !== undefined) cafe.description = description;
    if (phone !== undefined) cafe.phone = phone;
    if (tables !== undefined && Array.isArray(tables)) cafe.tables = tables;
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
    const { city } = req.query;
    const query = { isActive: true };
    if (city) {
      query.cityCode = city;
    }
    const cafes = await Cafe.find(query)
      .select("name cityCode address description phone photos")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ cafes });
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