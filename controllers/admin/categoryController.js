const constants = require("../../config/constants");
const response = require("../../config/response");
const Category = require("../../model/category");
const { Validator } = require("node-input-validator");
const helper = require("../../helper/helper");
const slugify = require("slugify");
const mongoose= require('mongoose');

module.exports.getAllCategory = async (req, res) => {
  try{
    let getList;
    let totalPages=1;

    if(req.body.page && req.body.limit){
      const page = parseInt(req.body.page); // Current page number
      const limit = parseInt(req.body.limit);
      const skip = (page - 1) * limit;
  
       getList = await Category.find(
        { }
      ).sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      const totalitems = getList.length;
      totalPages = Math.ceil(totalitems / limit);
    }else{
       getList = await Category.find({}).sort({ createdAt: -1 });
    }
   
    if (getList.length > 0) {
     
      return response.returnTrue(
        req,
        res,
       "record_found",
        getList,
        totalPages
      );
    } else {
      return response.returnFalse(req, res, "No Record Found", []);
    }
  }catch(err){
    return response.returnFalse(
      req,
      res,
      err.message,
      []
    )

  }

};

module.exports.addCategory = async (req, res) => {
  try {
    //check unique name
    const checkUniqueName = await Category.findOne({
      name: req.body.name.trim(),
    });
    if (checkUniqueName !== null) {
      return response.returnFalse(req, res, "Category name must be unique", []);
    }
    let v = new Validator(req.body, {
      name: "required|string",
    });
    let matched = await v.check();
    if (!matched) {
      return response.returnFalse(
        req,
        res,
        helper.validationErrorConvertor(v),
        {}
      );
    }
    if(req.file.filename){
      req.body.image = process.env.IMAGE_PATH + req.file.filename;
    }
    req.body.slug = slugify(req.body.name);
    const category = new Category(req.body);
    await category.save();
    return response.returnTrue(req, res, "Added Successfully", []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const categoryId =new mongoose.Types.ObjectId(req.params.id); 
    await Category.findByIdAndDelete(categoryId);
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports.updateCategory = async (req, res) => {
  try {

    console.log(req.body);
    let obj = {};
    if (req.body.name) {
      obj.name=req.body.name;
      req.body.slug = slugify(req.body.name);
    }
   if(req.body.titleAlt){
    obj.titleAlt=req.body.titleAlt;
   }
   if(req.body.order){
    obj.order=req.body.order;
   }
   if(req.body.status){
    obj.status=req.body.status;
   }
   if(req.file){
    const image = req.file?.filename;
    if (image) {
      obj.image = process.env.IMAGE_PATH + image;
    }
   }
    await Category.findByIdAndUpdate(new mongoose.Types.ObjectId(req.body.id), obj);
    return response.returnTrue(req, res, "update_success", []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

