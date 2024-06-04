const constants = require("../config/constants");
const jwt = require("jsonwebtoken");
const response = require("../config/response");
const User = require("../model/user");
const config = process.env;
module.exports = middlewares = {
  authenticateToken: async (req, res, next) => {
    try {
      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];
      if (!token) {
        return response.returnFalse(req, res, "Token required for auth", {});
      }
      try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        req.user = decoded;
      } catch (err) {
        let error_code = 461;
        return response.returnFalse(req, res, "invalid token", {}, error_code);
      }
      return next();
    } catch (err) {
      return response.returnFalse(req, res, "validation error message", {
        err,
      });
    }
  },

  adminAuthentication: async (req, res, next) => {
    try {
      if (!req.headers["version"]) {
        return response.returnFalse(req, res, "version_not_exist", {});
      } else if (req.headers["version"] != config.APP_VERSION) {
        return response.returnFalse(req, res, "version_not_match", {});
      }

      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (!token) {
        return response.returnFalse(req, res, "token_required_for_auth", {});
      }

      try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
        const roleId = decoded.id;
        const user = await User.findById(roleId);
        if (user.role != constants.CONST_ADMIN_ROLE) {
          let error_code = 461;
          return response.returnFalse(
            req,
            res,
            "invalid_token",
            {},
            error_code
          );
        }
        req.user = decoded;
      } catch (err) {
        let error_code = 461;
        return response.returnFalse(req, res, "invalid_token", {}, error_code);
      }

      return next();
    } catch (err) {
      return response.returnFalse(req, res, "validation_error_message", {
        err,
      });
    }
  },
};
