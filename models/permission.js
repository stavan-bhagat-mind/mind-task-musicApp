"use strict";
const { Model } = require("sequelize");
const { validationMessage, permissions } = require("../constant/constant");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: "role_permissions",
        foreignKey: "permission_id",
      });
    }
  }
  Permission.init(
    {
      permission_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: [/^[a-zA-Z0-9_]+$/],
            msg: validationMessage.OnlyLettersNumbersUnderscores,
          },
          len: {
            args: [3, 30],
            msg: validationMessage.mustBe3to30Long,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      identifier:{
        type:DataTypes.ENUM(Object.values(permissions)),
        allowNull: false,
      }
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Permission",
      tableName: "permissions",
    }
  );
  return Permission;
};
