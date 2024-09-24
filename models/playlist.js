"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    static associate(models) {
      Playlist.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Playlist.belongsToMany(models.Song, {
        through: "PlaylistSongs",
        foreignKey: "playlist_id",
      });
    }
  }
  Playlist.init(
    { 
      playlist_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      songs_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "songs",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Playlist",
      tableName: "playlists",
    }
  );
  return Playlist;
};


