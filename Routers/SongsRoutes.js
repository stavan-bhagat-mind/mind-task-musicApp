const {
  addSong,
  deleteSong,
  UpdateSongData,
  getSongData,
  getSearchData,
} = require("../Controllers/SongController/songController.js");
const authenticationMiddleware =require("../Middlewares/middleware.js");

const songRoute = require("express").Router();
songRoute.get("/get-data", getSongData);
songRoute.post("/add",authenticationMiddleware, addSong);
songRoute.patch("/update/:id",authenticationMiddleware, UpdateSongData);
songRoute.delete("/delete/:id",authenticationMiddleware, deleteSong);
songRoute.get("/search-data", getSearchData);

module.exports = songRoute;
