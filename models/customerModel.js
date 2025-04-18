const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    aadhaarNumber: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    isHost: { type: Boolean, default: false },

    loanAmount: { type: Number, required: true },
    interestRatePercent: { type: Number, required: true },
    totalPayableAmount: { type: Number, required: true },
    remainingAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },

    aadhaarPhotoUrl: { type: String },
    loanStartDate: { type: String },
    durationInDays: { type: Number },
    isActive: { type: Boolean, default: true },

    repaymentHistory: {
      type: [
        {
          date: String,
          amountPaid: Number,
        },
      ],
      default: [],
    },

    fines: {
      type: [
        {
          date: String,
          amount: Number,
          reason: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
