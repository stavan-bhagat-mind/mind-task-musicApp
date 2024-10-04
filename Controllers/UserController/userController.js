const Models = require("../../models/index");
const { http, errors, role, messages } = require("../../constant/constant");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { hashConvert, hashVerify } = require("../../services/helpers");
const {
  validateUserRegister,
  validateLogin,
  validateUpdateUserData,
  validateGenreData,
  validateUserSongHistory,
  validateRoleData,
  validatePermissionData,
  validateRolesAssign,
  validateUserRoleRegister,
  validateRolePermission,
  validateUpdateUserRole,
} = require("../../services/validations/userValidation");
const sendVerificationMail = require("../../config/email.config");
const { Op } = require("sequelize");

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

module.exports.roleUserRegister = async (req, res) => {
  try {
    const { token } = req.query;
    const { value } = validateUserRoleRegister(req.body, res);
    const hashPassword = await hashConvert(value.password);

    const decoded = jwt.verify(token, process.env.JWT_KEY_EMAIL);

    const newUser = await Models.User.create({
      user_name: value.name,
      user_password: hashPassword,
      user_type: role.subAdmin,
      email: decoded.data.email,
      role_id: decoded.data.role_id,
    });
    res.status(http.CREATED.code).send({
      success: true,
      data: {
        userName: newUser.user_name,
      },
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

module.exports.loginUser = async (req, res) => {
  try {
    const { value } = validateLogin(req.body, res);
    const user = await Models.User.findOne({
      where: {
        email: value.email,
      },
    });

    if (!user) {
      return res.status(http.NOT_FOUND.code).send({
        success: false,
        message: http.NOT_FOUND.message,
      });
    }
    await hashVerify(value.password, user.dataValues.user_password);

    const accessToken = jwt.sign(
      {
        data: { email: user.dataValues.email, id: user.dataValues.id },
      },
      process.env.JWT_KEY,
      { expiresIn: process.env.JWT_EXPIRE_TIME }
    );

    const refreshToken = jwt.sign(
      {
        data: { email: user.dataValues.email, id: user.dataValues.id },
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
    );

    res.status(http.ACCEPTED.code).send({
      success: true,
      data: {
        userName: user.dataValues.user_name,
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
    const deletedUser = await Models.User.destroy({
      where: {
        id,
      },
    });
    res.status(http.OK.code).send({
      success: true,
      message: messages.REMOVED,
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
    // const id = parseInt(req.params.id);
    const { id } = req.authUser;
    const { value } = validateUpdateUserData(req.body, res);

    const user = await Models.User.findOne({
      where: { id: id },
      attributes: ["id", "user_name", "user_password", "user_type", "email"],
    });
    console.log(user);
    const updateFields = {
      user_name: value.name,
      email: value.email,
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

module.exports.getUserList = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const { id } = req.authUser;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 5;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      var data = await Models.User.findAll({
        where: {},
        offset: offset,
        limit: limit,
      });
    }
    if (!data) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.status(http.OK.code).send({
      data,
      message: http.OK.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getUserData = async (req, res) => {
  try {
    const { id } = req.authUser;
    var data = await Models.User.findOne({
      where: { id },
      attributes: ["id", "user_name", "user_password", "user_type", "email"],
    });

    if (!data) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.status(http.OK.code).send({
      data,
      message: http.OK.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.addGenre = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { value } = validateGenreData(req.body);

    const genre = await Models.Genre.create({
      genre_name: value.genreName,
      creator_id: id,
    });

    res.status(http.OK.code).send({
      success: true,
      data: genre.dataValues.genre_name,
      message: http.OK.message,
    });
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.userSongHistory = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { value } = validateUserSongHistory(req.body);

    const data = await Models.Song.findOne({
      where: { id: value.song_id },
      include: [
        {
          model: Models.Genre,
          through: {
            attributes: [],
          },
          attributes: ["id"],
        },
      ],
    });
    const results = data.dataValues.Genres.map((value) => {
      return value.dataValues.id;
    });

    const existingHistories = await Models.UserSongHistory.findAll({
      where: { user_id: id, genre_id: { [Op.in]: results } },
    });

    const genrePlayCounts = {};
    existingHistories.forEach((history) => {
      genrePlayCounts[history.genre_id] = history;
    });
    const updatesAndCreates = results.map(async (genreId) => {
      if (genrePlayCounts[genreId]) {
        await Models.UserSongHistory.update(
          { genre_play_count: genrePlayCounts[genreId].genre_play_count + 1 },
          { where: { id: genrePlayCounts[genreId].id } }
        );
      } else {
        await Models.UserSongHistory.create({
          user_id: id,
          genre_id: genreId,
          genre_play_count: 1,
        });
      }
    });

    await Promise.all(updatesAndCreates);
    res.status(http.OK.code).send({
      success: true,
      message: http.OK.message,
    });
  } catch (error) {
    console.log(error);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.deleteUserHistory = async (req, res) => {
  try {
    const deleteId = parseInt(req.params.id);
    const { id } = req.authUser;
    const isAdmin = await Models.User.findOne({
      where: { id: id },
      order: [["createdAt", "DESC"]],
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const userSongHistory = Models.UserSongHistory.findAll({
        where: {
          id: deleteId,
        },
      });
      const idsToKeep = userSongHistory.slice(0, 3).map((entry) => entry.id);
      await Models.UserSongHistory.destroy({
        where: {
          id: req.params.id,
          id: { [Op.not]: idsToKeep },
        },
      });
      res.status(http.OK.code).send({
        success: true,
        message: http.OK.message,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getUserRecommendation = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { page, pageSize } = req.query;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 5;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const data = await Models.UserSongHistory.findAll({
      where: { user_id: id },
      attributes: ["genre_id", "genre_play_count"],
      order: [["genre_play_count", "DESC"]],
      limit: 2,
    });

    const genreId = data.map((value) => {
      return value.dataValues.genre_id;
    });
    // const songs = await Models.Genre.findAll({
    //   where: {
    //     id: {
    //       [Op.in]: genreId,
    //     },
    //   },
    //   include: [
    //     {
    //       model: Models.Song,
    //       through: {
    //         attributes: [],
    //       },
    //       attributes: ["id", "song_name", "singer"],
    //       distinct: true,
    //     },
    //   ],
    //   offset: offset,
    //   limit: limit,
    // });

    const songs = await Models.Song.findAll({
      // where: {
      //   id: {
      //     [Op.in]: genreId,
      //   },
      // },
      include: [
        {
          model: Models.Genre,
          through: {
            attributes: [],
          },
         where: {
        id: {
          [Op.in]: genreId,
        },
      },
          distinct: true,
        },
      ],
      attributes: ["id", "song_name", "singer"],
      offset: offset,
      limit: limit,
    });
    console.log(songs);
    const SuggestionSongs = songs.flatMap((value) => {
      const song = value.dataValues.Songs;
      return song.map((value) => value.dataValues);
    });

    const uniqueSuggestions = SuggestionSongs.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );

    if (!SuggestionSongs) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.status(http.OK.code).send({
      data: uniqueSuggestions,
      message: http.OK.message,
    });
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getUserPreferencePercentage = async (req, res) => {
  try {
    const { id } = req.authUser;
    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const id = parseInt(req.query.id);
      const data = await Models.UserSongHistory.findAll({
        where: { user_id: id },
        attributes: ["genre_id", "genre_play_count"],
        group: ["genre_id", "genre_play_count"],
        order: [["genre_play_count", "DESC"]],
      });

      const totalPlayCount = data.reduce((sum, value) => {
        return sum + value.dataValues.genre_play_count;
      }, 0);

      const genreIdPercentages = data.map((value) => {
        const genreId = value.dataValues.genre_id;
        const playCount = value.dataValues.genre_play_count;
        const percentage =
          totalPlayCount > 0 ? (playCount / totalPlayCount) * 100 : 0;

        return {
          genreId,
          percentage: percentage.toFixed(2),
        };
      });

      const userGenrePercentages = await Promise.all(
        genreIdPercentages.map(async (value) => {
          return await Models.Genre.findAll({
            where: { id: value.genreId },
            attributes: ["id", "genre_name"],
          });
        })
      );

      const genreData = userGenrePercentages.map(
        (value) => value[0].dataValues
      );
      const mergedData = genreIdPercentages.map((percentage) => {
        const genre = genreData.find((g) => g.id === percentage.genreId);
        return {
          ...genre,
          percentage: percentage.percentage,
        };
      });

      res.status(http.OK.code).send({
        success: true,
        data: mergedData,
        message: http.OK.message,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getRoleData = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const { id } = req.authUser;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 10;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      var data = await Models.Role.findAll({
        where: {},
        offset: offset,
        limit: limit,
      });
    }
    if (!data) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.status(http.OK.code).send({
      data,
      message: http.OK.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.userRolesAssign = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { value } = validateRolesAssign(req.body);

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const authToken = jwt.sign(
        {
          data: { email: value.email, role_id: value.role_id },
        },
        process.env.JWT_KEY_EMAIL,
        { expiresIn: process.env.JWT_EXPIRE_TIME_EMAIL }
      );
      await sendVerificationMail(value.email, authToken);
      res.status(http.OK.code).send({
        success: true,
        email: value.email,
        message: http.OK.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.addPermission = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { value } = validatePermissionData(req.body);
    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const permission = await Models.Permission.create({
        permission_name: value.role_name,
        description: value.description,
      });

      res.status(http.OK.code).send({
        success: true,
        data: permission.dataValues.genre_name,
        message: http.OK.message,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.addRole = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { value } = validateRoleData(req.body);
    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const role = await Models.Role.create({
        role_name: value.role_name,
        description: value.description,
      });

      res.status(http.OK.code).send({
        success: true,
        data: role.dataValues.genre_name,
        message: http.OK.message,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getPermissionData = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const { id } = req.authUser;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 10;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      var data = await Models.Permission.findAll({
        where: {},
        offset: offset,
        limit: limit,
      });
    }
    if (!data) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.status(http.OK.code).send({
      success: true,
      data,
      message: http.OK.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.rolePermissionAssign = async (req, res) => {
  try {
    const { id } = req.authUser;
    const { value } = validateRolePermission(req.body);
    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const role = await Models.Role.findByPk(value.role_id);

      if (!role) {
        return res.status(404).send({
          success: false,
          message: http.NOT_FOUND.message,
        });
      }
      const data = await role.addPermissions(value.permission_id);
      res.status(http.OK.code).send({
        success: true,
        data,
        message: http.OK.message,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.deleteRole = async (req, res) => {
  try {
    // const { id } = req.authUser;
    const id = parseInt(req.params.id);
    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const data = await Models.Role.destroy({
        where: {
          id,
        },
      });
      res.status(http.OK.code).send({
        success: true,
        data,
        message: messages.REMOVED,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.deletePermission = async (req, res) => {
  try {
    // const { id } = req.authUser;
    const id = parseInt(req.params.id);
    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const data = await Models.Permission.destroy({
        where: {
          id,
        },
      });
      res.status(http.OK.code).send({
        success: true,
        data,
        message: messages.REMOVED,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.UpdateRoleData = async (req, res) => {
  try {
    // const { id } = req.authUser;
    const id = parseInt(req.params.id);
    const { value } = validateRoleData(req.body, res);

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const updateFields = {
        role_name: value.role_name,
        description: value.description,
      };
      const [affectedRows] = await Models.Role.update(updateFields, {
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
        data: affectedRows,
        message: messages.REMOVED,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.UpdatePermissionData = async (req, res) => {
  try {
    // const { id } = req.authUser;
    const id = parseInt(req.params.id);
    const { value } = validatePermissionData(req.body, res);

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const updateFields = {
        permission_name: value.permission_name,
        description: value.description,
      };
      const [affectedRows] = await Models.Permission.update(updateFields, {
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
        data: affectedRows,
        message: messages.REMOVED,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getRolePermissionData = async (req, res) => {
  try {
    const { page, pageSize, role_id } = req.query;
    const { id } = req.authUser;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 10;
    const roleId = parseInt(role_id, 10);
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });
    if (isAdmin.dataValues.user_type === role.admin) {
      var data = await Models.Role.findOne({
        where: { id: roleId },
        attributes: ["id", "role_name", "description"],
        include: [
          {
            model: Models.Permission,
            through: {
              attributes: [],
            },
            attributes: ["id", "permission_name", "description"],
          },
        ],
        offset: offset,
        limit: limit,
      });
      console.log(data);
    }

    if (!data) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.status(http.OK.code).send({
      success: true,
      data,
      message: http.OK.message,
    });
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getRolePermissionList = async (req, res) => {
  try {
    const { page, pageSize, role_id } = req.query;
    const { id } = req.authUser;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 10;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });
    if (isAdmin.dataValues.user_type === role.admin) {
      var data = await Models.Role.findAll({
        include: [
          {
            model: Models.Permission,
            through: {
              attributes: [],
            },
            attributes: ["id", "permission_name", "description"],
          },
        ],
        offset: offset,
        limit: limit,
      });
      if (!data) {
        return res.status(http.NOT_FOUND.code).send({
          data,
          message: http.NOT_FOUND.message,
        });
      }
      res.status(http.OK.code).send({
        success: true,
        data,
        message: http.OK.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.UpdateRolePermissionData = async (req, res) => {
  try {
    // const { id } = req.authUser;
    const id = parseInt(req.params.id);
    const { value } = validateRolePermission(req.body, res);

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const role = await Models.Role.findByPk(value.role_id);
      if (!role) {
        return res.status(404).send({
          success: false,
          message: "Role not found",
        });
      }
      const data = await role.setPermissions(value.permission_id);

      res.status(http.OK.code).send({
        success: true,
        data,
        message: messages.REMOVED,
      });
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.UpdateUserRole = async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { id } = req.authUser;
    const { value } = validateUpdateUserRole(req.body, res);

    const isAdmin = await Models.User.findOne({
      where: { id: id },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const updateFields = {
        role_id: value.role_id,
      };
      const isSubAdmin = await Models.User.findOne({
        where: { id },
      });
      if (isSubAdmin.dataValues.user_type === role.subAdmin) {
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
          data: affectedRows,
          message: http.CREATED.message,
        });
      } else {
        res.status(http.NOT_FOUND.code).send({
          success: false,
          data: null,
          message: http.NOT_FOUND.message,
        });
      }
    } else {
      res.status(http.FORBIDDEN.code).send({
        success: false,
        data: null,
        message: http.FORBIDDEN.message,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};
