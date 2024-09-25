const {registerUser,loginUser,UpdateUserData, getAuthenticationToken, deleteUser,getUserData} =  require("../Controllers/UserController/userController.js");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const userRoute = require("express").Router();

userRoute.get("/getData", getUserData);
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.patch("/update/:id", authenticationMiddleware,UpdateUserData);
userRoute.delete("/delete/:id",authenticationMiddleware, deleteUser);
userRoute.get("/refresh", getAuthenticationToken);


// userRoute.get("/:id", getUserDataFromId);



module.exports =  userRoute;
