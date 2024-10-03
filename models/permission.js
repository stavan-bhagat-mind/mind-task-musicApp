"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
    //   Permission.belongsTo(models.Role, {
    //     foreignKey: "user_id",
    //   });
      Permission.belongsToMany(models.Role, {
        through: "RolePermissions",
        foreignKey: "permission_id",
      });
    }
  }
  Permission.init(
    {
      permission_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permission_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
