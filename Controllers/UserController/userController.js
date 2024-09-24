const Models = require("../../models/index");
const { Http, http } = require("../../constant/constant");
const { hashConvert } = require("../../services/helpers");
const {
  validateUserRegister,
} = require("../../services/validations/uservalidation");

module.exports.registerUser = async (req, res) => {
  try {
    const value = validateUserRegister(req.body,res);
    const hashPassword = hashConvert(value.password);
    const newUser = await Models.User.create({
      user_name: value.name,
      user_password: hashPassword,
      user_type: value.type,
    });
    res.status(Http.CREATED.code).send({
      success: true,
      data: {
        user_name: newUser.user_name,
      },
      message: http.CREATED.message,
    });
  } catch (e) {
    res.status(Http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: Http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(Http.NO_CONTENT.code)
        .send({ data: null, message: Http.NO_CONTENT.message });
    }
  } catch (e) {
    res.status(Http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: Http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getListOfUsers = async (req, res) => {
  try {
    const data = await Models.Author.findAndCountAll({
      offset: 0,
      limit: 2,
    });
    res.send({
      data,
    });
  } catch (e) {
    console.log(e);
    res.send({
      data: null,
      message: "Something went wrong.",
    });
  }
};

module.exports.getUserDataFromId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await Models.User.findOne({
      where: {
        id,
      },
    });
    if (!data) {
      return res.status(404).send({
        data,
        message: "User with given id does not exist",
      });
    }
    res.send({
      data,
      message: "Success",
    });
  } catch (e) {
    res.send({
      data: null,
      message: "Something went wrong.",
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
    res.send({
      data: null,
      message: "Something went wrong.",
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;
    const data = await Models.User.create({ name });
    res.send({
      data,
      message: "Success",
    });
  } catch (e) {
    res.send({
      data: null,
      message: "Something went wrong.",
    });
  }
};
