const IndexRoute = require("express").Router();
const userRoute = require("../Routers/UserRouter");
const songsRoute = require("../Routers/SongsRoutes");
const playlistRoute  = require("../Routers/PlaylistRoutes");
// const {LoggerMiddleware} = require("../Middlewares/loggerMiddleware");

IndexRoute.use("/users", userRoute);
IndexRoute.use("/songs", songsRoute);
IndexRoute.use("/playlist", playlistRoute);

module.exports = IndexRoute;
