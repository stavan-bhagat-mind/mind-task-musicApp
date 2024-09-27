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
        foreignKey: "creator_id",
      });
      User.hasMany(models.UserSongHistory, {
        foreignKey: "user_id",
      });
      User.hasMany(models.AccessControl, {
        foreignKey: "user_id",
      });
      User.hasMany(models.Genre, {
        foreignKey: "creator_id",
      });
      User.belongsToMany(models.Genre, {
        through: "user_genre",
        foreignKey: "user_id",
        // otherKey: "genre_id",
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
