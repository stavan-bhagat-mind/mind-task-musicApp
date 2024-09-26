"use strict";
const { Model } = require("sequelize");
const { role } = require("../constant/constant");

module.exports = (sequelize, DataTypes) => {
  class UserSongHistory extends Model {
    static associate(models) {
    //     UserSongHistory.hasMany(models.Playlist, {
    //     foreignKey: "user_id",
    //   });
      UserSongHistory.hasMany(models.Song, {
        foreignKey: "creator_id",
      });
    }
  }
  UserSongHistory.init(
    {
      user_name: {
        type: DataTypes.STRING,
      },
      user_password: {
        type: DataTypes.STRING,
      },
      user_type: {
        type: DataTypes.ENUM(Object.values(role)),
      },
      email:{
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: "User",
      timestamps:true,
      tableName: "users",
    }
  );
  return UserSongHistory;
};
