"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Song extends Model {}
  Song.init(
    {
      song_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      modelName: "Song",
      tableName: "songs",
    }
  );
  return Song;
};
