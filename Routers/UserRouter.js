const { baseURL, role, permissions } = require("../constant/constant.js");
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
    getUserData,
    getPermissionData,
    rolePermissionAssign,
    deleteRole,
    deletePermission,
    UpdateRoleData,
    UpdatePermissionData,
    UpdateRolePermissionData,
    getRolePermissionData,
    getRolePermissionList,
    UpdateUserRole,
  } = require("../Controllers/UserController/userController.js");
const authenticationMiddleware=require("../Middlewares/middleware.js");
const authRoleMiddleware=require("../Middlewares/accessControl.middleware.js");
const userRoute = require("express").Router();

// get requests
userRoute.get("/get-user-list",authenticationMiddleware,authRoleMiddleware([role.admin,role.subAdmin],permissions), getUserList);
userRoute.get("/get-user-data",authenticationMiddleware,authRoleMiddleware([role]), getUserData);
userRoute.get("/get-role-data",authenticationMiddleware,authRoleMiddleware([role.admin]), getRoleData);
userRoute.get("/get-permission-data",authenticationMiddleware,authRoleMiddleware([role.admin]), getPermissionData);
userRoute.get("/get-role-permission-data",authenticationMiddleware,authRoleMiddleware([role.admin]), getRolePermissionData);
userRoute.get("/get-role-permission-List",authenticationMiddleware,authRoleMiddleware([role.admin]), getRolePermissionList);
userRoute.get("/refresh",authenticationMiddleware, getAuthenticationToken);
userRoute.get("/get-recommendation",authenticationMiddleware,authRoleMiddleware([...Object.values(role)]), getUserRecommendation);
userRoute.get("/user-genre-percentage", authenticationMiddleware,authRoleMiddleware([role]),getUserPreferencePercentage);
userRoute.get("/user-role-register", (req, res) => {
  const token = req.query.token;
  res.render("invites/index", { token, baseURL });
});
// post requests
userRoute.post("/register",authRoleMiddleware([role.user]), registerUser);
userRoute.post("/role-user-register", roleUserRegister);
userRoute.post("/login", loginUser);
userRoute.post("/add-genre",authenticationMiddleware, authRoleMiddleware([role.admin,role.subAdmin],permissions), addGenre);
userRoute.post("/add-role",authenticationMiddleware,authRoleMiddleware([role.admin]), addRole);
userRoute.post("/add-permission",authenticationMiddleware,authRoleMiddleware([role.admin]), addPermission);
userRoute.post("/user-song-history", authenticationMiddleware,userSongHistory);
userRoute.post("/user-role-assign",authenticationMiddleware,authRoleMiddleware([role.admin]), userRolesAssign);
userRoute.post("/role-permission-assign",authenticationMiddleware,authRoleMiddleware([role.admin]), rolePermissionAssign);
// patch requests
userRoute.patch("/update/:id", authenticationMiddleware,authRoleMiddleware([...Object.values(role)]),UpdateUserData);
userRoute.patch("/update-permission/:id", authenticationMiddleware,authRoleMiddleware([role.admin]),UpdatePermissionData);
userRoute.patch("/update-role/:id", authenticationMiddleware,authRoleMiddleware([role.admin]),UpdateRoleData);
userRoute.patch("/update-role-permission", authenticationMiddleware,authRoleMiddleware([role.admin]),UpdateRolePermissionData);
userRoute.patch("/update-user-role/:id", authenticationMiddleware,authRoleMiddleware([role.admin]),UpdateUserRole);
// delete requests
userRoute.delete("/delete/:id",authenticationMiddleware,authRoleMiddleware([...Object.values(role)]), deleteUser);
userRoute.delete("/delete-user-history/:deleteUserId",authenticationMiddleware,authRoleMiddleware([role.admin,role.subAdmin]), deleteUserHistory);
userRoute.delete("/delete-role/:id",authenticationMiddleware,authRoleMiddleware([role.admin]), deleteRole);
userRoute.delete("/delete-permission/:id",authenticationMiddleware,authRoleMiddleware([role.admin]), deletePermission);

module.exports =  userRoute;
