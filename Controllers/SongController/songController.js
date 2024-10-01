const Models = require("../../models/index");
const { http, messages } = require("../../constant/constant");

const {
  validateAddSongs,
} = require("../../services/validations/songValidation");

module.exports.addSong = async (req, res) => {
  try {
    const { value } = validateAddSongs(req.body, res);
    const song = await Models.Song.create({
      song_name: value.song_name,
      singer: value.singer,
      creator_id: value.creator_id,
    });

    await song.addGenres(value.genres);
    res.status(http.OK.code).send({
      success: true,
      data: song.dataValues.song_name,
      message: http.OK.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.deleteSong = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Models.Song.destroy({
      where: {
        id,
      },
    });
    res.send({
      message: messages.REMOVE,
    });
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
    const id = parseInt(req.params.id);
    const { name, meta, singer } = req.body;

    const updateFields = {
      song_name: name,
      meta,
      singer,
    };
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

    res.status(http.OK.code).send({
      success: true,
      data: name,
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
    res.send({
      data,
      message: http.OK.message,
    });
  } catch (e) {
    console.log(e);
    res.send({
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.getSearchData = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("query", query, "typeof", typeof query);

    const data = await Models.Song.findAll({
      where: Models.Song.sequelize.where(
        Models.Song.sequelize.fn(
          "JSON_CONTAINS",
          Models.Song.sequelize.col("meta"),
          query
        ),
        true
      ),
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
    res.send({
      data: null,
      message: "Something went wrong.",
    });
  }
};
