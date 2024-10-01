const {
    registerUser,
    loginUser,
    UpdateUserData,
    getAuthenticationToken,
    deleteUser,
    getUserData,
    addGenre,
    userSongHistory,
    deleteUserHistory,
    getUserRecommendation,
    getUserPreference,
    //   accessControl,
  } = require("../Controllers/UserController/userController.js");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const userRoute = require("express").Router();

userRoute.get("/get-user-data",authenticationMiddleware, getUserData);
userRoute.get("/refresh",authenticationMiddleware, getAuthenticationToken);
userRoute.get("/get-recommendation",authenticationMiddleware, getUserRecommendation);
userRoute.get("/user-genre-percentage", authenticationMiddleware,getUserPreference);
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.post("/add-genre",authenticationMiddleware, addGenre);
userRoute.post("/user-song-history", authenticationMiddleware,userSongHistory);
userRoute.patch("/update/:id", authenticationMiddleware,UpdateUserData);
userRoute.delete("/delete/:id",authenticationMiddleware, deleteUser);
userRoute.delete("/delete-user-history/:id",authenticationMiddleware, deleteUserHistory);
// userRoute.post("/access-control", accessControl);

module.exports =  userRoute;
