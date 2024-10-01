"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserSongHistory extends Model {
    static associate(models) {
      UserSongHistory.belongsTo(models.Genre, {
        foreignKey: "genre_id",
      });
      UserSongHistory.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  UserSongHistory.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      genre_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "genres",
          key: "id",
        },
      },
      genre_play_count: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "UserSongHistory",
      timestamps: true,
      tableName: "user_song_history",
    }
  );
  return UserSongHistory;
};
