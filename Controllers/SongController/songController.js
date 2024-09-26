const Models = require("../../models/index");
const { http, messages } = require("../../constant/constant");

const {
  validateAddSongs,
} = require("../../services/validations/songValidation");

module.exports.addSong = async (req, res) => {
  try {
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

// exports.searchProducts = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ message: 'Query is required' });
//     }
//     const searchRegex = new RegExp(query, 'i');

//     const isCategory = await Product.exists({ category: searchRegex });
//     const isBrand = await Product.exists({ brandName: searchRegex });

//     let searchQuery = {};
//     let type = 'productName';

//     if (isCategory) {
//       searchQuery = { category: searchRegex };
//       type = 'category';
//     } else if (isBrand) {
//       searchQuery = { brandName: searchRegex };
//       type = 'brandName';
//     } else {
//       searchQuery = { productName: searchRegex };
//     }

//     const products = await Product.find(searchQuery);
//     console.log('products', products);

//     res.status(200).json({ data: products, type, term: query });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

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
