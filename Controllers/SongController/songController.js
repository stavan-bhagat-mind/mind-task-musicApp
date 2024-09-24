const Models = require("../../models/index");
const {Http} = require("../../constant/constant");

module.exports.addSong = async (req, res) => {
  try {
    const { name, genre, singer } = req.body;
    if (!name || !genre || !singer) {
      return res
        .status(Http.NO_CONTENT.code)
        .send({ data: null, message: Http.NO_CONTENT.message });
    }

    const data = await Models.User.create({ name, genre, singer });
    res.status(Http.OK.code).send({
      data,
      message: Http.OK.message,
    });
  } catch (e) {
    res.status(Http.INTERNAL_SERVER_ERROR.code).send({
      data: null,
      message: Http.INTERNAL_SERVER_ERROR.message,
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
