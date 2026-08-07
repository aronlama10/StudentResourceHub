require("dotenv").config();

const cloudinary = require("./config/cloudinary");

(async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Connected to Cloudinary");
    console.log(result);
  } catch (err) {
    console.log("❌ Cloudinary connection failed");
    console.dir(err, { depth: null });
  }
})();