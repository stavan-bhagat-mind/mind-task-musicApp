const Joi = require("joi");
const { http, role } = require("../../constant/constant");

const validateUserRegister = (data, res) => {
  const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    type: Joi.string()
      .valid(...Object.values(role))
      .required(),
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

const validateUserRoleRegister = (data, res) => {
  const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
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

const validateLogin = (data, res) => {
  const loginValidationSchema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().min(6).required(),
  });
  const { error, value } = loginValidationSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validateUpdateUserData = (data, res) => {
  const validateUpdateUserDataSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
  });
  const { error, value } = validateUpdateUserDataSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validateGenreData = (data, res) => {
  const validateGenreDataSchema = Joi.object({
    genreName: Joi.string().min(3).max(30).required(),
  });
  const { error, value } = validateGenreDataSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validateUserSongHistory = (data, res) => {
  const validateUserSongHistorySchema = Joi.object({
    song_id: Joi.number().required(),
  });
  const { error, value } = validateUserSongHistorySchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validateRolesAssign = (data, res) => {
  const validateRolesAssignSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    role_id: Joi.number().required(),
  });
  const { error, value } = validateRolesAssignSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validatePermissionData = (data, res) => {
  const validatePermissionDataSchema = Joi.object({
    permission_name: Joi.string()
      .pattern(/^[a-zA-Z0-9_]+$/)
      .min(3)
      .max(30)
      .required(),
    description: Joi.string().required(),
  });
  const { error, value } = validatePermissionDataSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validateRoleData = (data, res) => {
  const validateRoleDataSchema = Joi.object({
    role_name: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });
  const { error, value } = validateRoleDataSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validateRolePermission = (data, res) => {
  const validateRolePermissionSchema = Joi.object({
    role_id: Joi.number().required(),
    permission_id: Joi.array().items(Joi.number()).required(),
  });
  const { error, value } = validateRolePermissionSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

const validateUpdateUserRole = (data, res) => {
  const validateUpdateUserRoleSchema = Joi.object({
    role_id: Joi.number().required(),
  });
  const { error, value } = validateUpdateUserRoleSchema.validate(data);
  if (error) {
    return res.status(http.BAD_REQUEST.code).send({
      success: false,
      message: http.BAD_REQUEST.message,
      details: error.details.map((detail) => detail.message),
    });
  }
  return {
    success: true,
    value,
  };
};

module.exports = {
  validateUserRegister,
  validateLogin,
  validateUpdateUserData,
  validateGenreData,
  validateUserSongHistory,
  validateRolesAssign,
  validateRoleData,
  validatePermissionData,
  validateUserRoleRegister,
  validateRolePermission,
  validateUpdateUserRole,
};
