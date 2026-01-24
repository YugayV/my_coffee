const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

const cafeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    cityCode: { type: String },
    address: { type: String },
    description: { type: String },
    bookingInfo: { type: String },
    phone: { type: String },
    openingHours: { type: String },
    averageCheck: { type: Number },
    menu: [
      {
        name: { type: String, required: true },
        price: { type: Number },
        category: { type: String },
        description: { type: String },
      },
    ],
    photos: [
      {
        url: String,
        originalName: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tables: [
      {
        name: String,
        capacity: Number,
        position: { x: Number, y: Number },
      },
    ],
    isActive: { type: Boolean, default: true },
    isPromoted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Cafe = mongoose.model("Cafe", cafeSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String }
});
const User = mongoose.model("User", userSchema);


async function checkCafeData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const cafeId = "696de304954b1b011b40e3bb";
    console.log(`Searching for cafe with ID: ${cafeId}`);

    if (!mongoose.Types.ObjectId.isValid(cafeId)) {
        console.error("Invalid Cafe ID format.");
        return;
    }

    const cafe = await Cafe.findById(cafeId).populate("owner");
    
    if (!cafe) {
      console.log("❌ Cafe not found in database.");
    } else {
      console.log("✅ Cafe found:");
      console.log(`   Name: ${cafe.name}`);
      console.log(`   ID: ${cafe._id}`);
      console.log(`   City Code: ${cafe.cityCode || "N/A"}`);
      console.log(`   Active: ${cafe.isActive}`);
      
      if (cafe.owner) {
          console.log(`✅ Owner found: ${cafe.owner.name} (${cafe.owner._id})`);
      } else {
          console.log("❌ WARNING: Cafe has no owner linked!");
      }

      if (cafe.menu && cafe.menu.length > 0) {
          console.log(`✅ Menu items: ${cafe.menu.length}`);
      } else {
          console.log("⚠️ Cafe has no menu items.");
      }

      if (cafe.photos && cafe.photos.length > 0) {
          console.log(`✅ Photos: ${cafe.photos.length}`);
      } else {
          console.log("⚠️ Cafe has no photos.");
      }
      
      console.log("\nFull Cafe Object (for inspection):");
      console.log(JSON.stringify(cafe, null, 2));
    }

  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

checkCafeData();
