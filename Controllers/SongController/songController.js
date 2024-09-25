const Models = require("../../models/index");
const { http, messages } = require("../../constant/constant");
const {
  validateAddSongs,
} = require("../../services/validations/songValidation");

module.exports.addSong = async (req, res) => {
  try {
    // const { name, genre, singer } = req.body;
    // if (!name || !genre || !singer) {
    //   return res
    //     .status(Http.NO_CONTENT.code)
    //     .send({ data: null, message: Http.NO_CONTENT.message });
    // }
    const { value } = validateAddSongs(req.body, res);
    console.log(value);
    const data = await Models.Song.create({
      song_name: value.song_name,
      meta: value.meta,
      singer: value.singer,
      creator_id: value.creator_id,
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
      singer
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
    const data = await Models.Song.findAll();
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

// module.exports.getListOfUsers = async (req, res) => {
//     try {
//         const data = await Models.Author.findAndCountAll({
//             offset: 0,
//             limit: 2,
//         });
//         res.send({
//             data,
//         });

//     } catch (e) {
//         console.log(e);
//         res.send({
//             data: null,
//             message: "Something went wrong."
//         });
//     }
// };

// module.exports.getUserDataFromId = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         const data = await Models.User.findOne({
//             where: {
//                 id,
//             }
//         });
//         if(!data) {
//             return res.status(404).send({
//                 data,
//                 message: "User with given id does not exist"
//             });
//         }
//         res.send({
//             data,
//             message: "Success"
//         });
//     } catch (e) {
//         res.send({
//             data: null,
//             message: "Something went wrong."
//         });
//     }
// };

// module.exports.deleteUser = async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         await Models.User.destroy({
//             where: {
//                 id,
//             }
//         });
//         res.send({
//             message: "User removed successfully."
//         });
//     } catch (e) {
//         res.send({
//             data: null,
//             message: "Something went wrong."
//         });
//     }
// };
