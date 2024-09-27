"use strict";
const { Model } = require("sequelize");
require("dotenv").config;

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
  
      Genre.belongsToMany(models.Song, {
        through: "song_genres",
        foreignKey: "genre_id",
        otherKey: "song_id",
      });
      Genre.belongsToMany(models.User, {
        through: "user_genre",
        foreignKey: "genre_id",
        // otherKey: "genre_id",
      });
    }
  }
  Genre.init(
    {
      genre_name: {
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
      modelName: "Genre",
      timestamps: true,
      tableName: "genres",
    }
  );
  return Genre;
};
