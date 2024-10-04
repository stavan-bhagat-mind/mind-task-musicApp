const { http } = require("../constant/constant");
require("dotenv").config;

const authRoleMiddleware = (roles) => async (req, res, next) => {
  try {
    const user = req.authUser;
    !roles.includes(user.user_type)
      ? res.status(http.FORBIDDEN.code).json(http.FORBIDDEN.message)
      : next();
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports = authRoleMiddleware;
