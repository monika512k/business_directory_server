const mongoose = require("mongoose");
const constants = require("../config/constants");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    // required: true,
    unique: true,
    maxLength: 150,
  },
  mobile_no: {
    type: Number,
    trim: true,
    maxLength: 15,
  },
  role: {
    type: String,
    required: true,
    enum: [constants.CONST_USER_ROLE, constants.CONST_ADMIN_ROLE],
    default: constants.CONST_USER_ROLE,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: String,
    required: true,
    enum: [
      constants.CONST_USER_VERIFIED_TRUE,
      constants.CONST_USER_VERIFIED_FALSE,
    ],
    default: constants.CONST_USER_VERIFIED_FALSE,
  },
  profile_image: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  address2: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  pin_code: {
    type: String,
    default: "",
  },
  accountVerified: {
    type: String,
    required: true,
    enum: [
      constants.CONST_USER_VERIFIED_TRUE,
      constants.CONST_USER_VERIFIED_FALSE,
    ],
    default: constants.CONST_USER_VERIFIED_FALSE,
  },
  otp: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: [
      constants.CONST_DB_STATUS_ACTIVE,
      constants.CONST_DB_STATUS_INACTIVE,
    ],
    default: constants.CONST_DB_STATUS_ACTIVE,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports=mongoose.model("User",UserSchema)