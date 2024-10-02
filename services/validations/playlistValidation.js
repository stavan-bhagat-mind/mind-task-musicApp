const Joi = require("joi");
const { http } = require("../../constant/constant");

const validatePlaylist = (data, res) => {
  const playlistValidationSchema = Joi.object({
    playlist_name: Joi.string().min(3).max(30).required(),
  });
  const { error, value } = playlistValidationSchema.validate(data);
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

const validateAddSongPlaylist = (data, res) => {
  const playlistValidationSchema = Joi.object({
    playlist_id: Joi.number().required(),
    song_id: Joi.number().required(),
  });
  const { error, value } = playlistValidationSchema.validate(data);
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

module.exports = {
  validatePlaylist,
  validateAddSongPlaylist,
};
