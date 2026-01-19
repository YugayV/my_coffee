const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

mongoose.set("strictQuery", true);

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

const cafeSchema = new mongoose.Schema({}, { strict: false });
const Cafe = mongoose.model("Cafe", cafeSchema);

const paymentSchema = new mongoose.Schema({}, { strict: false });
const Payment = mongoose.model("Payment", paymentSchema);

const cafeSubscriptionSchema = new mongoose.Schema({}, { strict: false });
const CafeSubscription = mongoose.model("CafeSubscription", cafeSubscriptionSchema);

const cafePostSchema = new mongoose.Schema({}, { strict: false });
const CafePost = mongoose.model("CafePost", cafePostSchema);

const phoneVerificationSchema = new mongoose.Schema({}, { strict: false });
const PhoneVerification = mongoose.model("PhoneVerification", phoneVerificationSchema);

async function resetDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Delete all cafes
    const cafes = await Cafe.deleteMany({});
    console.log(`Deleted ${cafes.deletedCount} cafes.`);

    // 2. Delete all cafe subscriptions
    const subs = await CafeSubscription.deleteMany({});
    console.log(`Deleted ${subs.deletedCount} subscriptions.`);

    // 3. Delete all cafe posts
    const posts = await CafePost.deleteMany({});
    console.log(`Deleted ${posts.deletedCount} posts.`);

    // 4. Delete all payments
    const payments = await Payment.deleteMany({});
    console.log(`Deleted ${payments.deletedCount} payments.`);
    
    // 5. Delete all phone verifications
    const verifications = await PhoneVerification.deleteMany({});
    console.log(`Deleted ${verifications.deletedCount} phone verifications.`);

    // 6. Delete all users EXCEPT admin
    // We assume admins have isAdmin: true.
    const users = await User.deleteMany({ isAdmin: { $ne: true } });
    console.log(`Deleted ${users.deletedCount} users (kept admins).`);

    console.log("Database reset complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error resetting database:", err);
    process.exit(1);
  }
}

resetDb();
