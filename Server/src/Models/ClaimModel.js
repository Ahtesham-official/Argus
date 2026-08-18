const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    patientId: {
      type: String,
      required: true,
      index: true,
    },

    providerId: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    procedureCode: {
      type: String,
      required: true,
    },

    diagnosisCode: {
      type: String,
      required: true,
    },

    admissionDate: {
      type: Date,
      required: true,
    },

    dischargeDate: {
      type: Date,
      required: true,
    },

    billedAmount: {
      type: Number,
      required: true,
    },

    source: {
      type: String,
      enum: ["historical", "submitted"],
      default: "submitted",
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ClaimModel = mongoose.model("Claim", claimSchema);

module.exports = ClaimModel;