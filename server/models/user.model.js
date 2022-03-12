const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: {
      number: { type: String, unique: true },
      counter: { type: Number, default: 0 }
    },
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("User", userSchema);