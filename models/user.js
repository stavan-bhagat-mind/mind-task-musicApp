"use strict";
const { Model } = require("sequelize");
const { role } = require("../constant/constant");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Playlist, {
        foreignKey: "user_id",
      });
      User.hasMany(models.Song, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
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
  return User;
};
