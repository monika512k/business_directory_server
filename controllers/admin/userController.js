const constants = require("../../config/constants");
const response = require("../../config/response");
const User = require("../../model/user");
const mongoose = require("mongoose");
module.exports.getAllUser = async (req, res, next) => {

  try {
    let getList;
    let totalPages=1;

    if(req.body.page && req.body.limit){
      const page = parseInt(req.body.page); // Current page number
      const limit = parseInt(req.body.limit);
      const skip = (page - 1) * limit;
  
       getList = await User.find(
        {role:constants.CONST_USER_ROLE }
      ).sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      const totalitems = getList.length;
      totalPages = Math.ceil(totalitems / limit);
    }else{
       getList = await User.find( {role:constants.CONST_USER_ROLE }).sort({ createdAt: -1 });
    }
    if (getList.length > 0) {
      return response.returnTrue(
        req,
        res,
        "Record Found",
        getList,
        totalPages
      );
    } else {
      return response.returnFalse(
        req,
        res,
        "No Record Found",
        []
      );
    }
  } catch (e) {
    return response.returnFalse(
      req,
      res,
      "oops please try again",
      {}
    );
  }
};
module.exports.changesUserStatus=async(req,res,next)=>{
  try{
let obj={}
    let userD=await User.find({_id:new mongoose.Types.ObjectId(req.params.id)})
   if(userD[0].status=="Active"){
    obj.status="Inactive"
   }else{
    obj.status="Active"
   }
    const updRecord= await User.findByIdAndUpdate(new mongoose.Types.ObjectId(req.params.id),obj);
    updRecord.save();
    if(updRecord){
      return response.returnTrue(
        req,
        res,
        "Status updated successfully",
        updRecord
      )
    }else{
      return response.returnFalse(
        req,
        res,
        "failed to change status",
        []
      )
    }
  
   
  }catch(error){
    return response.returnFalse(
      req,
      res,
      error.message,
      []
    )
  }   
}