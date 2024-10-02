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

const playlistRoute = require("express").Router();

playlistRoute.post("/add",authenticationMiddleware, addPlaylist);
playlistRoute.get("/get-data",authenticationMiddleware, getAllPlaylistData);
playlistRoute.get("/get-playlist-song-data",authenticationMiddleware, getPlaylistSongData);
playlistRoute.delete("/delete/:id",authenticationMiddleware, deletePlaylist);
playlistRoute.patch("/update/:id",authenticationMiddleware, updatePlaylist);
playlistRoute.post("/add-song-playlist",authenticationMiddleware, addSongPlaylist);
playlistRoute.delete("/delete-song/:id/playlist/:playlistId",authenticationMiddleware, deleteSongFromPlaylist);

module.exports = playlistRoute;
