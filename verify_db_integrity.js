const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

// Schemas (simplified for validation)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    role: { type: String }
});
const User = mongoose.model("User", userSchema);

const cafeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    cityCode: { type: String },
    address: { type: String },
    menu: [{
        name: { type: String, required: true },
        price: Number
    }],
    isActive: { type: Boolean }
});
const Cafe = mongoose.model("Cafe", cafeSchema);

const cafeSubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true },
});
const CafeSubscription = mongoose.model("CafeSubscription", cafeSubscriptionSchema);

async function verifyIntegrity() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected.");

        // 1. Verify Users
        console.log("\n--- Verifying Users ---");
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);
        let userErrors = 0;
        users.forEach(u => {
            if (!u.name) {
                console.error(`❌ User ${u._id} missing name`);
                userErrors++;
            }
        });
        if (userErrors === 0) console.log("✅ All users have names.");

        // 2. Verify Cafes
        console.log("\n--- Verifying Cafes ---");
        const cafes = await Cafe.find({});
        console.log(`Found ${cafes.length} cafes.`);
        let cafeErrors = 0;
        
        // Cache user IDs for faster lookup
        const userIds = new Set(users.map(u => u._id.toString()));

        for (const cafe of cafes) {
            let hasError = false;
            if (!cafe.name) {
                console.error(`❌ Cafe ${cafe._id} missing name`);
                hasError = true;
            }
            if (!cafe.owner) {
                console.error(`❌ Cafe ${cafe._id} missing owner field`);
                hasError = true;
            } else if (!userIds.has(cafe.owner.toString())) {
                console.error(`❌ Cafe ${cafe._id} has orphan owner ID: ${cafe.owner}`);
                hasError = true;
            }

            if (cafe.menu && cafe.menu.length > 0) {
                cafe.menu.forEach((m, idx) => {
                    if (!m.name) {
                        console.error(`❌ Cafe ${cafe._id} menu item #${idx} missing name`);
                        hasError = true;
                    }
                });
            }

            if (hasError) cafeErrors++;
        }
        if (cafeErrors === 0) console.log("✅ All cafes look good.");

        // 3. Verify Subscriptions
        console.log("\n--- Verifying Subscriptions ---");
        const subs = await CafeSubscription.find({});
        console.log(`Found ${subs.length} subscriptions.`);
        let subErrors = 0;
        
        const cafeIds = new Set(cafes.map(c => c._id.toString()));

        for (const sub of subs) {
            if (!userIds.has(sub.user.toString())) {
                console.error(`❌ Subscription ${sub._id} references missing user ${sub.user}`);
                subErrors++;
            }
            if (!cafeIds.has(sub.cafe.toString())) {
                console.error(`❌ Subscription ${sub._id} references missing cafe ${sub.cafe}`);
                subErrors++;
            }
        }
        if (subErrors === 0) console.log("✅ All subscriptions are valid.");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\nDone.");
    }
}

verifyIntegrity();
