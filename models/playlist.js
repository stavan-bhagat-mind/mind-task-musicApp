"use strict";
const {
  Model
} = require("sequelize");
const User=require("./user");
const Song=require("./songs");

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
  }
  Playlist.init({
    playlist_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      playlist_name: {
        type: DataTypes.STRING,
      },
      songs_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Song,
          key: "song_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: "user_id",
        },
      },
  }, {
    sequelize,
    modelName: "Playlist",
    tableName: "playlists"
  });
  return Playlist;
};
