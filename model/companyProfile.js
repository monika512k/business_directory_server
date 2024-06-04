const mongoose = require("mongoose");
const constants = require("../config/constants");

const companyProfileShema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    
  },
  mobile_no: {
    type: String,
    required: true,
    // unique: true,
    maxLength: 150,
  },
  email: {
    type: String,
    //required: true,
    default: "",
    //unique: true
  },
  address: {
    type: String,
    required: true,
    maxLength: 250,
  },
  country: {
    type: String,
    // required: true,
    autopopulate: true,
  },
  logo:{
    type: String,
    required: true,
  },
  description:{
    type: String,
   
  },
industry:{
    type: String,
    default: "",
},
website:{
    type: String,
    default: "",
},
status: {
    type: String,
    enum: [
      "Active",
      "Inactive",
    ],
    default: "Active",
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("companyProfile", companyProfileShema);
