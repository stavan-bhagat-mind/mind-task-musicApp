const {
  addSong,
  deleteSong,
  UpdateSongData,
  getSongData,
} = require("../Controllers/SongController/songController.js");

const songRoute = require("express").Router();
songRoute.get("/getData", getSongData);
songRoute.post("/add", addSong);
songRoute.patch("/update/:id", UpdateSongData);
songRoute.delete("/delete/:id", deleteSong);

module.exports = songRoute;
