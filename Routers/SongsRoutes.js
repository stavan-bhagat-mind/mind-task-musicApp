const {
  addSong,
  deleteSong,
  UpdateSongData,
  getSongData,
  getSearchData
} = require("../Controllers/SongController/songController.js");

const songRoute = require("express").Router();
songRoute.get("/get-data", getSongData);
songRoute.post("/add", addSong);
songRoute.patch("/update/:id", UpdateSongData);
songRoute.delete("/delete/:id", deleteSong);
songRoute.get("/search-data", getSearchData);

module.exports = songRoute;
