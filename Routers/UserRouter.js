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
    getUserPreferencePercentage,
    //   accessControl,
  } = require("../Controllers/UserController/userController.js");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const userRoute = require("express").Router();

userRoute.get("/get-user-data",authenticationMiddleware, getUserData);
userRoute.get("/refresh",authenticationMiddleware, getAuthenticationToken);
userRoute.get("/get-recommendation",authenticationMiddleware, getUserRecommendation);
userRoute.get("/user-genre-percentage", authenticationMiddleware,getUserPreferencePercentage);
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.post("/add-genre",authenticationMiddleware, addGenre);
userRoute.post("/user-song-history", authenticationMiddleware,userSongHistory);
userRoute.patch("/update/:id", authenticationMiddleware,UpdateUserData);
userRoute.delete("/delete/:id",authenticationMiddleware, deleteUser);
userRoute.delete("/delete-user-history/:deleteUserId",authenticationMiddleware, deleteUserHistory);
// userRoute.post("/access-control", accessControl);

module.exports =  userRoute;
