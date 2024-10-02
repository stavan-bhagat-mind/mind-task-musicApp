const Models = require("../../models/index");
const { http, messages } = require("../../constant/constant");
const {
  validatePlaylist,
  validateAddSongPlaylist,
} = require("../../services/validations/playlistValidation");

module.exports.addPlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const { value } = validatePlaylist(req.body, res);
    const data = await Models.Playlist.create({
      playlist_name: value.playlist_name,
      user_id: userId,
    });
    res.status(http.OK.code).send({
      success: true,
      data,
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

module.exports.deletePlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id);

    await Models.Playlist.destroy({
      where: {
        id,
        user_id: userId,
      },
    });
    res.status(http.OK.code).send({
      success: true,
      message: messages.REMOVED,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports.deleteSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    const playlistId = parseInt(req.params.playlistId);

    const playlist = await Models.Playlist.findOne({
      where: { id: playlistId, user_id: userId },
    });
    if (!playlist) {
      return res.status(http.NOT_FOUND.code).send({
        success: false,
        message: http.NOT_FOUND.message,
      });
    }
    const songs = await Models.Song.findOne({ where: { id: id } });
    if (songs.length === 0) {
      return res.status(http.NOT_FOUND.code).send({
        success: false,
        message: http.NOT_FOUND.message,
      });
    }
    await playlist.removeSongs(songs);

    res.status(http.OK.code).send({
      success: true,
      playlistId: playlist.id,
      removedSongs: songs,
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

module.exports.updatePlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    const { value } = validatePlaylist(req.body);

    const updateFields = {
      playlist_name: value.playlist_name,
    };
    const [affectedRows] = await Models.Playlist.update(updateFields, {
      where: {
        id: id,
        user_id: userId,
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
      data: { affectedRows: affectedRows },
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
module.exports.getAllPlaylistData = async (req, res) => {
  try {
    const userId = req.userId;
    const { page, pageSize } = req.query;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 5;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const data = await Models.Playlist.findAll({
      where: {
        user_id: userId,
      },
      offset: offset,
      limit: limit,
    });

    res.status(http.OK.code).send({
      success: true,
      data,
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

module.exports.getPlaylistSongData = async (req, res) => {
  try {
    const userId = req.userId;
    const { page, pageSize, playlistId } = req.query;
    const currentPage = parseInt(page, 10) || 0;
    const currentPageSize = parseInt(pageSize, 10) || 5;
    const offset = currentPage * currentPageSize;
    const limit = currentPageSize;

    const data = await Models.Playlist.findAll({
      where: {
        id: playlistId,
        user_id: userId,
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
      offset: offset,
      limit: limit,
    });
    res.status(http.OK.code).send({
      success: true,
      data,
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

module.exports.addSongPlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const { value } = validateAddSongPlaylist(req.body, res);
    const playlist = await Models.Playlist.findOne({
      where: { id: value.playlist_id, user_id: userId },
    });
    if (!playlist) {
      return res.status(http.NOT_FOUND.code).send({
        success: false,
        message: http.NOT_FOUND.message,
      });
    }
    const songIds = Array.isArray(value.song_id)
      ? value.song_id
      : [value.song_id];
    const songs = await Models.Song.findAll({ where: { id: songIds } });

    if (songs.length === 0) {
      res.status(http.NOT_FOUND.code).send({
        success: false,
        message: http.NOT_FOUND.message,
      });
    }
    await playlist.addSongs(songs);

    res.status(http.OK.code).send({
      success: true,
      playlistId: playlist.id,
      addedSongs: songs,
      message: http.OK.message,
    });
  } catch (e) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      success: false,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};
