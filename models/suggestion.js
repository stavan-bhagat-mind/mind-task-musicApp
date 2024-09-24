"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Suggestion extends Model {}
  Suggestion.init(
    {
      song_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "songs",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model:"users",
          key: "id",
        },
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
