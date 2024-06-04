const User= require('../../model/user');
const response=require("../../config/response");
const bcrypt= require('bcrypt');
const jwt = require("jsonwebtoken");
const helper = require('../../helper/helper');
const { Validator } = require('node-input-validator');
const constants = require('../../config/constants');


const companyProfile = require("../../model/companyProfile");
const mongoose= require('mongoose');

module.exports.adminLogin=async(req,res,next)=>{
    try{

        const userDefaultInfo = await User.find({ role: "2" });
        if (userDefaultInfo.length == 0) {
          const postData = {
            email: "admin@gmail.com",
            // password: '123456',
            name: "admin",
            role: "2",
          };
    
          const salt = await bcrypt.genSalt(10);
          postData.password = await bcrypt.hash("123456", salt);
          const user = new User(postData);
          await user.save();
          return response.returnTrue(
            req,
            res,
           "single record Add",
            {}
          );
        }else{
            const data= req.body;
            const v = new Validator(data, {
                email: 'required|email',
                password: 'required'
            });
            let matched = await v.check();
    
            if (!matched) {
                return response.returnFalse(req, res, helper.validationErrorConvertor(v), {});
            }
            const userInfo = await User.findOne({email: data.email,role:constants.CONST_ADMIN_ROLE});
            
            if (!userInfo) {
              return response.returnFalse(req, res, "Email not found user does not exist", {});
            }
    
            if(userInfo && (await bcrypt.compare(data.password, userInfo.password))) {
                const token = jwt.sign(
                    { id: userInfo._id },
                    process.env.JWT_TOKEN_KEY,
                    {
                        expiresIn: constants.CONST_VALIDATE_SESSION_EXPIRE,
                    }
                );
                let tempObj = {
                    _id: userInfo._id,
                    email: userInfo.email,
                    name: userInfo.name,
                    token: token
                };
      
                return response.returnTrue(req, res, "Login successfully", tempObj);
                }
    
        }



       
    }catch(err){
    return response.returnFalse(req, res,err.message,[]
    )
    }

}


module.exports.companyProfile = async (req, res, next) => {
  try {
   
    const checkUniqueName = await companyProfile.findOne({});
    let v = new Validator(req.body, {
      companyName: "required|string",
      address: "required|string",
      // logo: "required|string"
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
    if (checkUniqueName== null) {
      if (req.file) {
        const image = req.file?.filename;
        if (image) {
          req.body.logo = process.env.IMAGE_PATH + image;
        }
      }
      delete req.body._id;
      const profile = new companyProfile(req.body);
    let data=  await profile.save();
    return response.returnTrue(req, res,"update success",data);

    } else {

      if (req.file) {
        const image = req.file?.filename;
        if (image) {
          req.body.logo = process.env.IMAGE_PATH + image;
        }
      }
    const data=  await companyProfile.findByIdAndUpdate({_id:new mongoose.Types.ObjectId(req.body._id.trim())}, req.body);
    return response.returnTrue(req, res,"update success", data);

    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.viewCompanyProfile = async (req, res, next) => {
  try {
   
    const data = await companyProfile.findOne({});
    return response.returnTrue(req, res,"Record Found", data);
    }
   catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports.changePassword = async (req, res, next) => {
  const body = req.body;

  const v = new Validator(req.body, {
    // id: 'required',
    old_pass: "required",
    new_pass: "required",
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

  try {
    const userInfo = await User.findById(req.user.id);
    const validPassword = await bcrypt.compare(
      body.old_pass,
      userInfo.password
    );

    if (!validPassword) {
      return response.returnFalse(
        req,
        res,
        res.translate("invalid_password"),
        {}
      );
    }

    const salt = await bcrypt.genSalt(10);
    let password = await bcrypt.hash(body.new_pass, salt);

    const updateInfo = await User.updateOne(
      { _id: req.user.id },
      { $set: { password: password } }
    );

    if (updateInfo.modifiedCount == 1) {
      return response.returnTrue(
        req,
        res,
        "password changed successfully",
        {}
      );
    } else {
      return response.returnFalse(
        req,
        res,
        "oops please try again",
        {}
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
