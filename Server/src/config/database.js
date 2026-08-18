const mongoose = require("mongoose");
const ProviderModel = require("../Models/ProviderModel");
const PolicyModel = require("../Models/PolicyModel");
const ClaimModel = require("../Models/ClaimModel");
const { generateSeedData } = require("../data/seed");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    // Check and seed initial data if needed
    const providerCount = await ProviderModel.countDocuments();
    const samplePolicy = await PolicyModel.findOne();
    if (providerCount === 0 || !samplePolicy || !samplePolicy.waitingPeriodMonths) {
      console.log("Seeding / re-seeding clean initial data into MongoDB...");
      await ProviderModel.deleteMany({});
      await PolicyModel.deleteMany({});
      await ClaimModel.deleteMany({});
      const { providers, policies, historicalClaims } = generateSeedData();
      await ProviderModel.insertMany(providers);
      await PolicyModel.insertMany(policies);
      const claimsToInsert = historicalClaims.map((c) => ({ ...c, source: "historical" }));
      await ClaimModel.insertMany(claimsToInsert);
      console.log("Database successfully seeded with clean initial data.");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

module.exports = connectDB;