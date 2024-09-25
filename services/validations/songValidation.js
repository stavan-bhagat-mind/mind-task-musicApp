const Joi = require("joi");
const { http } = require("../../constant/constant");

const validateAddSongs = (data, res) => {
    const songValidationSchema = Joi.object({
      song_name: Joi.string().min(3).max(30).required(),
      meta: Joi.array().items(Joi.string()).required(),
      singer: Joi.string().required(),
      creator_id: Joi.number().required(),
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
  
  module.exports={
    validateAddSongs,
  };