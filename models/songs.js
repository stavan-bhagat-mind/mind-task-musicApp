"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    static associate(models) {
      Song.belongsToMany(models.Playlist, {
        through: "PlaylistSongs",
        foreignKey: "song_id",
      });
      Song.belongsTo(models.User, {
        foreignKey: "creator_id",
      });
      // Song.hasMany(models.UserSongHistory, {
      //   foreignKey: "song_id",
      // });
      Song.belongsToMany(models.Genre, {
        through: "song_genres",
        foreignKey: "song_id",
        otherKey: "genre_id",
      });
    }
  }
  Song.init(
    {
      song_name: {
        type: DataTypes.STRING,
      },
      singer: {
        type: DataTypes.STRING,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Song",
      tableName: "songs",
    }
  );
  return Song;
};
