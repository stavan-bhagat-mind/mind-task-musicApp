const { http, errors } = require("../constant/constant");
require("dotenv").config;
const jwt = require("jsonwebtoken");
const Models = require("../models/index");

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authenticationToken = req.headers["authorization"];
    if (!authenticationToken) {
      return res.status(http.UNAUTHORIZED.code).send({
        success: false,
        data: null,
        message: errors.TOKEN_NOT_PROVIDED,
      });
    }
    const token = authenticationToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const user = await Models.User.findOne({
      where: { id: decoded.data.id },
      attributes: [
        "id",
        "user_name",
        "user_type",
        "user_password",
        "email",
        "role_id",
      ],
    });
    req.authUser = user.dataValues;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(http.UNAUTHORIZED.code).send({
        data: null,
        message: errors.TOKEN_EXPIRE,
        errorName: error.name,
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(http.FORBIDDEN.code).send({
        data: null,
        message: errors.INVALID_TOKEN,
        errorName: error.name,
      });
    } else {
      return res.status(http.INTERNAL_SERVER_ERROR.code).send({
        data: null,
        message: http.INTERNAL_SERVER_ERROR.message,
      });
    }
  }
};

module.exports = authenticationMiddleware;
