const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confessionSchema = new Schema(
  {
    heading: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    reports: [
      {
        user: String,
        reason: String,
        reportedAt: { type: Date, default: Date.now() },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Confession", confessionSchema);
