const IndexRoute = require("express").Router();
const userRoute = require("../Routers/UserRouter");
const songsRoute = require("../Routers/SongsRoutes");

const {LoggerMiddleware} = require("../Middlewares/loggerMiddleware");


IndexRoute.use("/users", LoggerMiddleware , userRoute);
IndexRoute.use("/songs", LoggerMiddleware , songsRoute);



module.exports = IndexRoute;
