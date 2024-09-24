const {registerUser,loginUser,getListOfUsers, getUserDataFromId, createUser, deleteUser} =  require("../Controllers/UserController/userController.js");

const userRoute = require("express").Router();

userRoute.get("/register", registerUser);
userRoute.get("/login", loginUser);
userRoute.get("/all", getListOfUsers);
userRoute.get("/:id", getUserDataFromId);
userRoute.delete("/:id", deleteUser);
userRoute.post("/add", createUser);

module.exports =  userRoute;
