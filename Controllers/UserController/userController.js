const Models = require("../../models/index");
const { http, errors } = require("../../constant/constant");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { hashConvert, hashVerify } = require("../../services/helpers");
const {
  validateUserRegister,
  validateLogin,
} = require("../../services/validations/userValidation");

module.exports.registerUser = async (req, res) => {
  try {
    const { value } = validateUserRegister(req.body, res);
    const hashPassword = await hashConvert(value.password);

    const newUser = await Models.User.create({
      user_name: value.name,
      user_password: hashPassword,
      user_type: value.type,
      email: value.email,
    });
    res.status(http.CREATED.code).send({
      success: true,
      data: {
        userName: newUser.user_name,
      },
      message: http.CREATED.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { value } = validateLogin(req.body, res);
    const User = await Models.User.findOne({
      where: {
        email: value.email,
      },
    });

    if (!User) {
      return res.status(http.NOT_FOUND.code).send({
        success: false,
        message: http.NOT_FOUND.message,
      });
    }
    await hashVerify(value.password, User.dataValues.user_password);

    const accessToken = jwt.sign(
      {
        data: { email: User.dataValues.email, id: User.dataValues.id },
      },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRE_TIME }
    );

    const refreshToken = jwt.sign(
      {
        data: { email: User.dataValues.email, id: User.dataValues.id },
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
    );

    res.status(http.ACCEPTED.code).send({
      success: true,
      data: {
        userName: User.dataValues.user_name,
      },
      accessToken,
      refreshToken,
      message: http.ACCEPTED.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Models.User.destroy({
      where: {
        id,
      },
    });
    res.send({
      message: "User removed successfully.",
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getAuthenticationToken = async (req, res) => {
  try {
    const refreshToken = req.headers["refresh-token"];
    if (!refreshToken)
      throw { isError: true, message: errors.TOKEN_NOT_PROVIDED };
    const token = refreshToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);
  
    const accessToken = jwt.sign(
      {
        data: decoded.data,
      },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRE_TIME }
    );
    res.status(http.CREATED.code).send({
      success: true,
      accessToken,
      message: http.CREATED.message,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(http.UNAUTHORIZED.code).send({
        success: false,
        data: null,
        message: errors.TOKEN_EXPIRE,
        errorName: error.name,
      });
    } else if (error.name === "JsonWebTokenError") {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: errors.INVALID_TOKEN,
        errorName: error.name,
      });
    } else {
      res.status(http.INTERNAL_SERVER_ERROR.code).send({
        success: false,
        data: null,
        message: http.INTERNAL_SERVER_ERROR.message,
      });
    }
  }
};

module.exports.UpdateUserData = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, type } = req.body;

    const updateFields = {
      user_name: name,
      email: email,
      user_type: type,
    };
    const [affectedRows] = await Models.User.update(updateFields, {
      where: {
        id,
      },
    });
    if (affectedRows === 0) {
      return res.status(http.NOT_FOUND.code).send({
        success: false,
        data: null,
        message: http.NOT_FOUND.message,
      });
    }

    res.status(http.OK.code).send({
      success: true,
      data: name,
      message: http.CREATED.message,
    });
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getUserData = async (req, res) => {
  try {
    const data = await Models.User.findAll();
    if (!data) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.send({
      data,
      message: http.OK.message,
    });
  } catch (e) {
    res.send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

// module.exports.getUserDataFromId = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id);
//     const data = await Models.User.findOne({
//       where: {
//         id,
//       },
//     });
//     if (!data) {
//       return res.status(404).send({
//         data,
//         message: "User with given id does not exist",
//       });
//     }
//     res.send({
//       data,
//       message: "Success",
//     });
//   } catch (e) {
//     res.send({
//       data: null,
//       message: "Something went wrong.",
//     });
//   }
// };

// module.exports.createUser = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const data = await Models.User.create({ name });
//     res.send({
//       data,
//       message: "Success",
//     });
//   } catch (e) {
//     res.send({
//       data: null,
//       message: "Something went wrong.",
//     });
//   }
// };
