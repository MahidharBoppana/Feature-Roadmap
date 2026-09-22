import dotenv from "dotenv";
import connectDB from "../src/config/database.js";
import User from "../src/models/User.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@featurehub.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const admin = await User.create({
      name: "FeatureHub Admin",
      email: adminEmail,
      password: "Admin@12345",
      role: "admin",
      isEmailVerified: true,
    });

    console.log("Admin created successfully:");
    console.log(`Email: ${admin.email}`);
    console.log("Password: Admin@12345");

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  }
};

seedAdmin();
