const {registerUser,loginUser,UpdateUserData, getAuthenticationToken, deleteUser,getUserData,accessControl,addGenre,userSongHistory,deleteUserHistory,getUserRecommendation,getUserPreference} =  require("../Controllers/UserController/userController.js");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const userRoute = require("express").Router();

userRoute.get("/get-data", getUserData);
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.patch("/update/:id", authenticationMiddleware,UpdateUserData);
userRoute.delete("/delete/:id",authenticationMiddleware, deleteUser);
userRoute.post("/access-control", accessControl);
userRoute.get("/refresh", getAuthenticationToken);
userRoute.post("/add-genre",authenticationMiddleware, addGenre);
userRoute.post("/user-song-history", authenticationMiddleware,userSongHistory);
userRoute.delete("/delete-user-history/:id", deleteUserHistory);
userRoute.get("/get-recommendation",authenticationMiddleware, getUserRecommendation);
userRoute.get("/user-genre-percentage", authenticationMiddleware,getUserPreference);
// userRoute.get("/:id", getUserDataFromId);


 
module.exports =  userRoute;
