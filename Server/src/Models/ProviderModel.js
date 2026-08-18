const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    providerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    specialty: { type: String },
    networkHospital: { type: Boolean, default: true },
    claimCount: { type: Number, default: 0 },
    flaggedCount: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

const ProviderModel = mongoose.model("Provider", providerSchema);
module.exports = ProviderModel;