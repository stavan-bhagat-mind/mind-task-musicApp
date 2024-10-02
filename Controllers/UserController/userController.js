const Models = require("../../models/index");
const { http, errors, role } = require("../../constant/constant");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { hashConvert, hashVerify } = require("../../services/helpers");
const {
  validateUserRegister,
  validateLogin,
  validateUpdateUserData,
  validateGenreData,
  validateUserSongHistory,
} = require("../../services/validations/userValidation");
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
    res.status(http.OK.code).send({
      message: http.OK.message,
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
    const userId = req.userId;
    const { value } = validateUpdateUserData(req.body, res);

    const user = await Models.User.findOne({
      where: { id: userId },
      attributes: ["id", "user_name", "user_password", "user_type", "email"],
    });
    const userType = user.dataValues.user_type;

    const updateFields = {
      user_name: value.name,
      email: value.email,
      user_type: userType === role.admin ? value.type : role.user,
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
    const { page, pageSize } = req.query;
    const userId = req.userId;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 5;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const isAdmin = await Models.User.findOne({
      where: { id: userId },
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

module.exports.addGenre = async (req, res) => {
  try {
    const userId = req.userId;
    const { value } = validateGenreData(req.body);
    const isAdmin = await Models.User.findOne({
      where: { id: userId },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const genre = await Models.Genre.create({
        genre_name: value.genreName,
        creator_id: userId,
      });

      res.status(http.OK.code).send({
        success: true,
        data: genre.dataValues.genre_name,
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

module.exports.userSongHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { value } = validateUserSongHistory(req.body);

    const data = await Models.Song.findAll({
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

    const results = data.map((song) => {
      const genreIds = song.Genres.map((genre) => genre.id);
      return { songName: song.song_name, genreIds: genreIds };
    });

    const genrePlayCounts = {};
    const existingHistories = await Models.UserSongHistory.findAll({
      where: { user_id: userId, genre_id: results[0].genreIds },
    });

    existingHistories.forEach((history) => {
      genrePlayCounts[history.genre_id] = history.genre_play_count;
    });

    const updatesAndCreates = results[0].genreIds.map(async (genreId) => {
      if (genrePlayCounts[genreId] !== undefined) {
        await Models.UserSongHistory.update(
          { genre_play_count: genrePlayCounts[genreId] + 1 },
          {
            where: {
              id: existingHistories.find(
                (history) => history.genre_id === genreId
              ).id,
            },
          }
        );
      } else {
        await Models.UserSongHistory.create({
          user_id: userId,
          genre_id: genreId,
          genre_play_count: 1,
        });
      }
    });

    const result = await Promise.all(updatesAndCreates);
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
    const deleteUserId = parseInt(req.params.id);
    const userId = req.userId;
    const isAdmin = await Models.User.findOne({
      where: { id: userId },
      order: [["createdAt", "DESC"]],
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const userSongHistory = Models.UserSongHistory.findAll({
        where: {
          id: deleteUserId,
        },
      });
      const idsToKeep = userSongHistory.slice(0, 3).map((entry) => entry.id);
      await Models.UserSongHistory.destroy({
        where: {
          userId: req.params.userId,
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
    const userId = req.userId;
    const { page, pageSize } = req.query;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 5;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const data = await Models.UserSongHistory.findAll({
      where: { user_id: userId },
      attributes: ["genre_id", "genre_play_count"],
      group: ["genre_id", "genre_play_count"],
      order: [["genre_play_count", "DESC"]],
      limit: 2,
    });

    const genreId = data.map((value) => {
      return value.dataValues.genre_id;
    });
    const songs = await Models.Genre.findAll({
      where: {
        id: {
          [Op.in]: genreId,
        },
      },
      include: [
        {
          model: Models.Song,
          through: {
            attributes: [],
          },
          attributes: ["id", "song_name", "singer"],
          distinct: true,
        },
      ],
      offset: offset,
      limit: limit,
    });

    const SuggestionSongs = songs.map((value) => {
      const song = value.dataValues.Songs;
      return song.map((value) => value.dataValues);
    });

    const flatResult = SuggestionSongs.flat(Infinity);

    const uniqueSuggestions = flatResult.filter(
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
    const userId = req.userId;
    const isAdmin = await Models.User.findOne({
      where: { id: userId },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const userID = parseInt(req.query.userId);
      const data = await Models.UserSongHistory.findAll({
        where: { user_id: userId },
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

// module.exports.accessControl = async (req, res) => {
//   try {
//     const { user_id, password } = req.body;
//     if (!user_id) {
//       res.status(http.NOT_FOUND.code).send({
//         data: null,
//         message: http.NOT_FOUND.message,
//       });
//     }
//     const User = await Models.User.findOne({ where: { id: user_id } });
//     if (!User) {
//       return res.status(http.NOT_FOUND.code).send({
//         User,
//         message: http.NOT_FOUND.message,
//       });
//     }
//     try {
//       await hashVerify(password, User.dataValues.user_password);
//     } catch (e) {
//       console.log("err", e);
//     }
//     await Models.AccessControl.create({ user_id: User.dataValues.id });
//     res.status(http.OK.code).send({
//       success: true,
//       message: http.OK.message,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(http.INTERNAL_SERVER_ERROR.code).send({
//       data: null,
//       message: http.INTERNAL_SERVER_ERROR.message,
//     });
//   }
// };
