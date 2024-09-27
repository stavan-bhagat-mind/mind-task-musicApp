"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AccessControl extends Model {
    static associate(models) {
      AccessControl.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    //   AccessControl.hasMany(models.Genre, {
    //     foreignKey: "creator_id",
    //   });
    }
  }
  AccessControl.init(
    {
        user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "AccessControl",
      timestamps: true,
      tableName: "access_control",
    }
  );
  return AccessControl;
};
