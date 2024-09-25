const {
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistData
}=require("../Controllers/PlaylistController/playlistController");

const playlistRoute = require("express").Router();

playlistRoute.post("/add", addPlaylist);
playlistRoute.get("/getData", getPlaylistData);
playlistRoute.delete("/delete/:id", deletePlaylist);
playlistRoute.patch("/update/:id", updatePlaylist);

module.exports = playlistRoute;
