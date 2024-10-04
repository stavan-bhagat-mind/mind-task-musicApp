const Joi = require("joi");
const { http } = require("../../constant/constant");

const validateSongs = (data, res) => {
    const songValidationSchema = Joi.object({
      song_name: Joi.string().min(3).max(30).required(),
      genres: Joi.array().items(Joi.number()).required(),
      singer: Joi.string().required(),
    });
    const { error, value } = songValidationSchema.validate(data);
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
  
  const validateSongGenre = (data, res) => {
    const validateSongGenreSchema = Joi.object({
      genre_id: Joi.array().items(Joi.number()).required(),
    });
    const { error, value } = validateSongGenreSchema.validate(data);
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
  
  module.exports={
    validateSongs,
    validateSongGenre
  };