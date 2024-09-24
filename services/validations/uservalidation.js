const Joi = require("joi");
const { http } = require("../../constant/constant");
// const userValidationSchema = Joi.object({
//   name: Joi.string().min(3).max(30).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
//   type: Joi.string().valid("admin", "user").required(),
// });

// const validateUser = (data) => {
//   return userValidationSchema.validate(data);
// };

// module.exports = {
//   validateUser,
// };
//

const validateUserRegister = (data,res) => {
  const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    type: Joi.string().valid("admin", "user").required(),
  });
  const { error, value } = userValidationSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      data: null,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });

  }
  return {
    success: true,
    value,
  };
};

const validateLogin = (data) => {
  const loginValidationSchema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().min(6).required(),
  });
  const { error, value } = loginValidationSchema.validate(data);
  if (error) {
    return {
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    };
  }
  return {
    success: true,
    value,
  };
};
module.exports = {
  validateUserRegister,
  validateLogin,
};
