require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

const CAFE_ID = "696de304954b1b011b40e3bb";

const cafeSchema = new mongoose.Schema({
  name: String,
  description: String,
  cityCode: String,
  address: String,
  phone: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  averageCheck: Number,
  openingHours: String, // JSON string
  menu: Array,
  photos: Array,
});

const Cafe = mongoose.model("Cafe", cafeSchema);

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to DB");
    try {
      if (!mongoose.Types.ObjectId.isValid(CAFE_ID)) {
          console.log("Invalid Cafe ID format");
          return;
      }
      const cafe = await Cafe.findById(CAFE_ID);
      if (cafe) {
        console.log("Cafe Found:");
        console.log(JSON.stringify(cafe, null, 2));
      } else {
        console.log("Cafe NOT found with ID:", CAFE_ID);
      }
    } catch (e) {
      console.error("Error finding cafe:", e);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(e => {
    console.error("DB Connection Error:", e);
  });
