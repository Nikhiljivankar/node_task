const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const passwordUtil = require('../utils/password');

const userSchema = mongoose.Schema({
  age: {
    type: Number,
    require: true
  },
  gender: {
    type: String,
    enum:["Male","Female","Other"],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  race_and_ethnicity: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    enum:["Monthly","Weekly"],
    // required: [true, "frequency is required"],// we can make it required
  },
  diagnosis_of_mental_conditions: {
    type: String,
    required: true,
  },
  diagnosis_of_physical_conditions: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  parentalConsent : {
    type: Boolean
  },
  userConsent : {
    type: Boolean
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
});


userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await passwordUtil.getHash(this.password);
  }

  next();
});

// compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
