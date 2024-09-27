const {registerUser,loginUser,UpdateUserData, getAuthenticationToken, deleteUser,getUserData,accessControl,addGenre,userSongHistory} =  require("../Controllers/UserController/userController.js");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const userRoute = require("express").Router();

userRoute.get("/get-data", getUserData);
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.patch("/update/:id", authenticationMiddleware,UpdateUserData);
userRoute.delete("/delete/:id",authenticationMiddleware, deleteUser);
userRoute.post("/access-control", accessControl);
userRoute.get("/refresh", getAuthenticationToken);
userRoute.post("/add-genre", addGenre);
userRoute.post("/user-song-history", authenticationMiddleware,userSongHistory);

// userRoute.get("/:id", getUserDataFromId);



module.exports =  userRoute;
