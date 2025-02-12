const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: { type: Array, default: [] },
  portfolio: { type: Array, default: [] },
});

module.exports = mongoose.model("User", UserSchema);