const Models = require("../../models/index");
const { http, messages } = require("../../constant/constant");
const {
  validateAddPlaylist,
} = require("../../services/validations/playlistValidation");

module.exports.addPlaylist = async (req, res) => {
  try {
    const { value } = validateAddPlaylist(req.body, res);
    console.log(value);
    const data = await Models.Playlist.create({
      playlist_name: value.playlist_name,
      songs_id: value.songs_id,
      user_id: value.user_id,
    });
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

module.exports.deletePlaylist = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Models.Playlist.destroy({
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

module.exports.updatePlaylist = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, songs_id, user_id } = req.body;

    const updateFields = {
      playlist_name: name,
      songs_id,
      user_id,
    };
    const [affectedRows] = await Models.Playlist.update(updateFields, {
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
module.exports.getPlaylistData = async (req, res) => {
  try {
    const data = await Models.Playlist.findAll();
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
