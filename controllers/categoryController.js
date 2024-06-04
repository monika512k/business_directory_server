
const response = require("../config/response");
const Category = require("../model/category");
module.exports.getAllCategory = async (req, res) => {
  try{
    const  getList = await Category.find({}).sort({ createdAt: -1 });
   
    if (getList.length > 0) {
     
      return response.returnTrue(
        req,
        res,
       "record_found",
        getList,
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


