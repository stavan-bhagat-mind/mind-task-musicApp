const {
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistData,
  addSongPlaylist
}=require("../Controllers/PlaylistController/playlistController");
const authenticationMiddleware=require("../Middlewares/middleware.js");

const playlistRoute = require("express").Router();

playlistRoute.post("/add", addPlaylist);
playlistRoute.get("/get-data", getPlaylistData);
playlistRoute.delete("/delete/:id", deletePlaylist);
playlistRoute.patch("/update/:id", updatePlaylist);
playlistRoute.post("/add-song-playlist",authenticationMiddleware, addSongPlaylist);

module.exports = playlistRoute;
