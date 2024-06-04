const mongoose = require("mongoose");
const constants = require("../config/constants");
const ProductSchema = mongoose.Schema({
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required:[true , "category is must"]
    
  },
  SubCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    
  },
  ChildCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "childcategories",
    
  },
  HomeCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HomeCategory",
  },

  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 150,
  },
  title:{
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxLength: 150,
  },

  image1: {
    type: String,
    default: "",
  },
  image1_alttext:{
    type: String,
    default: "",
  },
  image1_titleText:{
    type: String,
    default: "",
  },
  image2: {
    type: String,
    default: "",
  },
  image2_alttext:{
    type: String,
    default: "",
  },
  image2_titleText:{
    type: String,
    default: "",
  },
  image3: {
    type: String,
    default: "",
  },
  image3_alttext:{
    type: String,
    default: "",
  },
  image3_titleText:{
    type: String,
    default: "",
  },

  shortDescription: {
    type: String,
    required: true,
  },
  metaKeyword:{
    type:Array,
    default:[]
  },
  description:{
    type:String,
    default:""
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


module.exports = mongoose.model("Products", ProductSchema);
