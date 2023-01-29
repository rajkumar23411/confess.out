const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, default: "customer" },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dkukx5byz/image/upload/v1674634821/confession_avatar/3d_profile_lkycrm.jpg",
    },
    resetPasswordToken: String,
    resetPasswordExp: Date,
    updateEmailOtp: Number,
  },
  { timestamps: true }
);
//generating forgot password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hashing and adding to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExp = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("User", UserSchema);
