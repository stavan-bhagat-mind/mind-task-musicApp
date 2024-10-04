const {
  addSong,
  deleteSong,
  UpdateSongData,
  getSongData,
  getSearchData,
  UpdateSongGenreData,
} = require("../Controllers/SongController/songController.js");
const authenticationMiddleware = require("../Middlewares/middleware.js");
const authRoleMiddleware = require("../Middlewares/accessControl.middleware.js");
const { role } = require("../constant/constant.js");
const songRoute = require("express").Router();

songRoute.get("/get-data", authRoleMiddleware([role.admin,role.subAdmin]), getSongData);
songRoute.post("/add",authenticationMiddleware,authRoleMiddleware([role.admin,role.subAdmin]), addSong);
songRoute.patch("/update/:id",authenticationMiddleware,authRoleMiddleware([role.admin,role.subAdmin]), UpdateSongData);
songRoute.delete("/delete/:id",authenticationMiddleware,authRoleMiddleware([role.admin,role.subAdmin]), deleteSong);
songRoute.get("/search-data", getSearchData);
songRoute.patch("/update-song-genre/:id",authenticationMiddleware,authRoleMiddleware([role.admin,role.subAdmin]), UpdateSongGenreData);

module.exports = songRoute;
