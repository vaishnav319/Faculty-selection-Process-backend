const jwt = require("jsonwebtoken");
const { Users } = require("../api/v1/models/index");
var createError = require("http-errors");
const { JWT_ACCESS_KEY } = require("../core/config");
module.exports = {
  protect: async (req, res, next) => {
    let token;
    console.log("In users token verify");
    if (req.headers.authorization) {
      try {
        if (req.headers.authorization.startsWith("Bearer")) {
          token = req.headers.authorization.split(" ")[1];
        } else {
          token = req.headers.authorization;
        }
        const decoded = jwt.verify(token, JWT_ACCESS_KEY);
        req.user = await Users.findById(decoded.userId).select("-password");

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        next(createError(404, "Not Authorized, token failed"));
      }
    }

    if (!token) {
      res.status(401);
      next(createError(404, "Not Authorized, no token"));
    }
  },

  hrprotect: async (req, res, next) => {
    let token;
    console.log("In HRS token verify");

    if (req.headers.authorization) {
      try {
        if (req.headers.authorization.startsWith("Bearer")) {
          token = req.headers.authorization.split(" ")[1];
        } else {
          token = req.headers.authorization;
        }

        const decoded = jwt.verify(token, JWT_ACCESS_KEY);
        if (String(decoded.type) != "HR") {
          throw createError(
            501,
            "Not Authorized you are not a HR, token failed"
          );
        }
        req.user = await Users.findById(decoded.userId).select("-password");
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        next(createError(404, "Not Authorized, token failed"));
      }
    }

    if (!token) {
      res.status(401);
      next(createError(404, "Not Authorized, no token"));
    }
  },
  adminprotect: async (req, res, next) => {
    let token;

    if (req.headers.authorization) {
      try {
        if (req.headers.authorization.startsWith("Bearer")) {
          token = req.headers.authorization.split(" ")[1];
        } else {
          token = req.headers.authorization;
        }

        const decoded = jwt.verify(token, JWT_ACCESS_KEY);
        if (String(decoded.type) != "admin") {
          throw createError(
            501,
            "Not Authorized you are not a admin, token failed"
          );
        }
        req.user = await Users.findById(decoded.userId).select("-password");
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        next(createError(404, "Not Authorized, token failed"));
      }
    }

    if (!token) {
      res.status(401);
      next(createError(404, "Not Authorized, no token"));
    }
  },
};
