const { baseURL } = require("../constant/constant.js");
const {
    registerUser,
    loginUser,
    UpdateUserData,
    getAuthenticationToken,
    deleteUser,
    getUserList,
    addGenre,
    userSongHistory,
    deleteUserHistory,
    getUserRecommendation,
    getUserPreferencePercentage,
    userRolesAssign,
    getRoleData,
    addRole,
    addPermission,
    roleUserRegister,
    getUserData
    //   accessControl,
  } = require("../Controllers/UserController/userController.js");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const userRoute = require("express").Router();

userRoute.get("/get-user-list",authenticationMiddleware, getUserList);
userRoute.get("/get-user-data",authenticationMiddleware, getUserData);
userRoute.get("/get-role-data",authenticationMiddleware, getRoleData);
userRoute.get("/refresh",authenticationMiddleware, getAuthenticationToken);
userRoute.get("/get-recommendation",authenticationMiddleware, getUserRecommendation);
userRoute.get("/user-genre-percentage", authenticationMiddleware,getUserPreferencePercentage);
userRoute.post("/register", registerUser);
userRoute.post("/role-user-register", roleUserRegister);
userRoute.post("/login", loginUser);
userRoute.post("/add-genre",authenticationMiddleware, addGenre);
userRoute.post("/add-role",authenticationMiddleware, addRole);
userRoute.post("/add-permission",authenticationMiddleware, addPermission);
userRoute.post("/user-song-history", authenticationMiddleware,userSongHistory);
userRoute.patch("/update/:id", authenticationMiddleware,UpdateUserData);
userRoute.delete("/delete/:id",authenticationMiddleware, deleteUser);
userRoute.delete("/delete-user-history/:deleteUserId",authenticationMiddleware, deleteUserHistory);
userRoute.post("/user-role-assign",authenticationMiddleware, userRolesAssign);
userRoute.get("/user-role-register", (req, res) => {
  const token = req.query.token;
  res.render("invites/index", { token, baseURL });
});
// userRoute.get("/get-recommendation",authenticationMiddleware, getUserRecommendation);
// userRoute.post("/access-control", accessControl);

module.exports =  userRoute;
