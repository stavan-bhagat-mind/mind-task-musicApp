const {getListOfSong, getSongDataFromId, addSong, deleteSong} =  require("../Controllers/UserController/userController.js");

const songRoute = require("express").Router();

songRoute.get("/all", getListOfSong);
songRoute.get("/:id", getSongDataFromId);
songRoute.delete("/:id", deleteSong);
songRoute.post("/add", addSong);

module.exports =  songRoute;
