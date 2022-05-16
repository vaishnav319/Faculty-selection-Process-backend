const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const { JWT_ACCESS_KEY } = require("../core/config");

module.exports = {
  signAccessToken: (userId, type) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId: userId,
        type: type,
      };
      const secret = JWT_ACCESS_KEY;
      const options = {
        expiresIn: "7d",
        issuer: "faculty-admin",
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        resolve(token);
      });
    });
  },
};
