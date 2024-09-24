const {addSong} =  require("../Controllers/SongController/songController.js");

const songRoute = require("express").Router();
songRoute.post("/add", addSong);



module.exports =  songRoute;


// const {getListOfSong, getSongDataFromId, addSong, deleteSong} =  require("../Controllers/UserController/userController.js");

// songRoute.get("/all", getListOfSong);
// songRoute.get("/:id", getSongDataFromId);
// songRoute.delete("/:id", deleteSong);