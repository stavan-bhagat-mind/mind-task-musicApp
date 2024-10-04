const {
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getAllPlaylistData,
  addSongPlaylist,
  getPlaylistSongData,
  deleteSongFromPlaylist
}=require("../Controllers/PlaylistController/playlistController");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const authRoleMiddleware = require("../Middlewares/accessControl.middleware.js");
const { role } = require("../constant/constant.js");

const playlistRoute = require("express").Router();

playlistRoute.post("/add",authenticationMiddleware, addPlaylist);
playlistRoute.get("/get-data",authenticationMiddleware,authRoleMiddleware([role.admin,role.subAdmin]), getAllPlaylistData);
playlistRoute.get("/get-playlist-song-data",authenticationMiddleware,authRoleMiddleware([role]), getPlaylistSongData);
playlistRoute.delete("/delete/:id",authenticationMiddleware,authRoleMiddleware([role]), deletePlaylist);
playlistRoute.patch("/update/:id",authenticationMiddleware,authRoleMiddleware([role]), updatePlaylist);
playlistRoute.post("/add-song-playlist",authenticationMiddleware,authRoleMiddleware([role]), addSongPlaylist);
playlistRoute.delete("/delete-song/:id/playlist/:playlistId",authenticationMiddleware,authRoleMiddleware([role]), deleteSongFromPlaylist);

module.exports = playlistRoute;
