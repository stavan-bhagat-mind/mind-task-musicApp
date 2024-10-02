const Models = require("../../models/index");
const { http, messages, role } = require("../../constant/constant");
const { validateSongs } = require("../../services/validations/songValidation");

module.exports.addSong = async (req, res) => {
  try {
    const userId = req.userId;
    const { value } = validateSongs(req.body, res);
    const isAdmin = await Models.User.findOne({
      where: { id: userId },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const song = await Models.Song.create({
        song_name: value.song_name,
        singer: value.singer,
        creator_id: userId,
      });

      await song.addGenres(value.genres);
      res.status(http.OK.code).send({
        success: true,
        data: song.dataValues.song_name,
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
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.deleteSong = async (req, res) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id);

    const isAdmin = await Models.User.findOne({
      where: { id: userId },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      await Models.Song.destroy({
        where: {
          id,
        },
      });
      res.status(http.OK.code).send({
        success: true,
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
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.UpdateSongData = async (req, res) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    const { value } = validateSongs(req.body);
    const updateFields = {
      song_name: value.song_name,
      genres: value.meta,
      singer: value.singer,
    };

    const isAdmin = await Models.User.findOne({
      where: { id: userId },
    });

    if (isAdmin.dataValues.user_type === role.admin) {
      const [affectedRows] = await Models.Song.update(updateFields, {
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
      const song = await Models.Song.findByPk(id);
      await song.setGenres([]);
      await song.addGenres(value.genres);

      res.status(http.OK.code).send({
        success: true,
        message: messages.UPDATED,
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

module.exports.getSongData = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 5;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const data = await Models.Song.findAll({
      where: {},
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
  } catch (e) {
    console.log(e);
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getSearchData = async (req, res) => {
  try {
    const { query } = req.query;
    const genre = await Models.Genre.findOne({
      where: {
        genre_name: query,
      },
    });

    const data = await Models.Genre.findAll({
      where: {
        id: genre.dataValues.id,
      },
      include: [
        {
          model: Models.Song,
          through: {
            attributes: [],
          },
          attributes: ["id", "song_name", "singer"],
        },
      ],
      limit: 10,
    });
    if (!data) {
      return res.status(http.NOT_FOUND.code).send({
        data,
        message: http.NOT_FOUND.message,
      });
    }
    res.status(http.OK.code).send({
      success: true,
      data: data[0].dataValues.Songs,
      message: http.OK.message,
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
