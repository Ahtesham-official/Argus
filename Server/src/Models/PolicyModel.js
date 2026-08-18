const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policyId: { type: String },
    policyNumber: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["ACTIVE", "EXPIRED", "SUSPENDED"], default: "ACTIVE" },
    sumInsured: { type: Number, required: true },
    utilizedAmount: { type: Number, default: 0 },
    subLimits: { type: Object, default: {} },
    waitingPeriodMonths: { type: Object, default: { MATERNITY: 9, PRE_EXISTING: 24, DEFAULT: 1 } },
    startDate: { type: String },
    networkHospitalsOnly: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false }
);

const PolicyModel = mongoose.model("Policy", policySchema);
module.exports = PolicyModel;