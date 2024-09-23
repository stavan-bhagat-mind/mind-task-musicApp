"use strict";
const { Model } = require("sequelize");
const Song = require("./songs");
const User = require("./user");

module.exports = (sequelize, DataTypes) => {
  class Suggestion extends Model {}
  Suggestion.init(
    {
      suggestion_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      name: {
        type: DataTypes.STRING,
      },
      genre: {
        type: DataTypes.JSON,
      },
      singer: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Suggestion",
      tableName: "Suggestions",
    }
  );
  return Suggestion;
};
