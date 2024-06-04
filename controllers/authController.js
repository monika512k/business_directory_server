const User = require("../model/user");
const path = require("path");
const response = require("../config/response");
const constants = require("../config/constants");
const mongoose = require("mongoose");
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("keyforencryption");
const pug = require("pug");
const sendMail = require("../config/sendMail");
module.exports.register = async (req, res, next) => {
  const postData = req.body;

  let v;

  v = new Validator(req.body, {
    name: "required",
    mobile_no: "required",
    password: "required|string",
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

  const post_password = postData.password;

  // Check User exist
  try {
    const userDetails = await User.findOne({
      mobile_no: parseFloat(postData.mobile_no),
    });

    if (userDetails) {
      return response.returnFalse(req, res, "Mobile Number already exist", {});
    }

    // const salt = await bcrypt.genSalt(10);
    postData.password = await cryptr.encrypt(post_password);

    postData.accountVerified = constants.CONST_USER_VERIFIED_TRUE;
    postData.role = 1;

    const user = new User(postData);
    const userSave = await user.save();

    const userInsertId = userSave._id;

    const userInfo = await User.findOne(
      { _id: userInsertId },
      "password role name profile_image _id email mobile_no emailVerified"
    );
    console.log("user Details ===>>", userInfo);

    const token = jwt.sign({ id: userInfo._id }, process.env.JWT_TOKEN_KEY, {
      expiresIn: constants.CONST_VALIDATE_SESSION_EXPIRE,
    });

    let tempObj = {
      _id: userInfo._id,
      email: userInfo.email,
      mobile_no: userInfo.mobile_no,
      role: userInfo.role,
      name: userInfo.name,
      token: token,
    };
    return response.returnTrue(req, res, "registration successfully", tempObj);
  } catch (err) {
    return response.returnFalse(req, res, err.message, {});
  }
};

module.exports.login = async (req, res, next) => {
  const body = req.body;
  const v = new Validator(req.body, {
    mobile_no: "required",
    password: "required",
    role: "required",
  });

  let matched = await v.check();
  if (!matched) {
    console.log(v);
    return response.returnFalse(
      req,
      res,
      helper.validationErrorConvertor(v),
      {}
    );
  }

  try {
    const userDetails = await User.findOne(
      {
        mobile_no: parseFloat(body.mobile_no),
        role: body.role,
        status: "Active",
      },
      "password role name profile_image _id email mobile_no emailVerified"
    );

    if (body.role == 2) {
      if (userDetails && userDetails.emailVerified == "false") {
        return response.returnFalse(req, res, "email not verified", {});
      }
    }

    if (userDetails && body.password == cryptr.decrypt(userDetails.password)) {
      const token = jwt.sign(
        { id: userDetails._id },
        process.env.JWT_TOKEN_KEY,
        {
          expiresIn: constants.CONST_VALIDATE_SESSION_EXPIRE,
        }
      );
      let tempObj = {
        _id: userDetails._id,
        email: userDetails.email,
        mobile_no: userDetails.mobile_no,
        role: userDetails.role,
        name: userDetails.name,
        token: token,
      };

      return response.returnTrue(req, res, "login_successfully", tempObj);
    } else {
      return response.returnFalse(req, res, "invalid credentials", {});
    }
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};

module.exports.changePassword = async (req, res, next) => {
  const body = req.body;
  // id: 'required',
  const v = new Validator(req.body, {
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
      return response.returnFalse(req, res, "invalid_password", {});
    }

    const salt = await bcrypt.genSalt(10);
    var password = await bcrypt.hash(body.new_pass, salt);

    const updateInfo = await User.updateOne(
      { _id: req.user.id },
      { $set: { password: password } }
    );

    if (updateInfo.modifiedCount == 1) {
      return response.returnTrue(req, res, "password_changed_successfully", {});
    } else {
      return response.returnFalse(req, res, "oops_please_try_again", {});
    }
  } catch (e) {
    return response.returnFalse(req, res, "oops_please_try_again", {});
  }
};

module.exports.viewProfile = async (req, res, next) => {
  try {
    // console.log(req.user.id);
    const userInfo = await User.findById(req.user.id);
    if (userInfo) {
      return response.returnTrue(req, res, "Record Found", userInfo);
    } else {
      return response.returnFalse(req, res, "No Record Found", {});
    }
  } catch (e) {
    return response.returnFalse(req, res, "Oops please try again", {});
  }
};

module.exports.updateInfo = async (req, res, next) => {
  const body = req.body;
  const v = new Validator(req.body, {
    name: "required",
    // email: "required",
    mobile_no: "required",
    address: "required",
    state: "required",
    city: "required",
    pin_code: "required",
  });

  let matched = await v.check();
  if (req.file) {
    const image = req.file?.filename;
    if (image) {
      req.body.profile_image = process.env.IMAGE_PATH + image;
    }
  }
  if (!matched) {
    return response.returnFalse(
      req,
      res,
      helper.validationErrorConvertor(v),
      {}
    );
  }

  try {
    if (!req.body.name) {
      delete req.body.name;
    }
    if (!req.body.mobile_no) {
      delete req.body.mobile_no;
    }
    if (!req.body.address) {
      delete req.body.address;
    }
    if (!req.body.city) {
      delete req.body.city;
    }
    if (!req.body.state) {
      delete req.body.state;
    }
    if (!req.body.pin_code) {
      delete req.body.pin_code;
    }

    const updateInfo = await User.updateOne({ _id: req.user.id }, req.body);

    return response.returnTrue(req, res, "Profile updated success");
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  const body = req.body;
  let obj = {};

  const v = new Validator(req.body, {
    mobile_no: "required",
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
    const userInfo = await User.findOne({ mobile_no: body.mobile_no });
    if (userInfo) {
      // const salt = await bcrypt.genSalt(10);
      // const newPassword = helper.generateRandomPassword();
      // const password = await bcrypt.hash(newPassword, salt);
      // let otp = Math.floor(1000 + Math.random() * 9000);

      // const updateInfo = await User.updateOne(
      //   { email: body.email },
      //   { $set: { otp: otp } }
      // );

      // if (updateInfo.modifiedCount == 1) {
      // console.log(userInfo.email);
      // let verify_code = cryptr.encrypt(userInfo.email);
      // let link = `${constants.CONST_APP_URL}verifyEmail/${verify_code}`;

      let templateDir = "./templates/";
      let messageBody = pug.renderFile(`${templateDir}forgot_password.pug`, {
        name: userInfo.name,
        email: userInfo.email,
        // link: link,
        password: cryptr.decrypt(userInfo.password),
      });
      sendMail(
        userInfo.email.toLowerCase(),
        "forgot_password_reset",
        messageBody
      );
      obj.email = userInfo.email;

      return response.returnTrue(
        req,
        res,
        "Sent password to your registered  email address",
        obj
      );
      // }
    } else {
      return response.returnFalse(
        req,
        res,
        "Email address is not registered kindly contact to administrator",
        {}
      );
    }
  } catch (e) {
    return response.returnFalse(req, res, e.message, {});
  }
};




