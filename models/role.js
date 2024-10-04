"use strict";
const { Model } = require("sequelize");
const { validationMessage } = require("../constant/constant");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Permission, {
        through: "role_permissions",
        foreignKey: "role_id",
      });
    }
  }
  Role.init(
    {
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: [/^[a-zA-Z0-9_]+$/],
            msg: validationMessage.OnlyLettersNUmbersUnderscores,
          },
          len: {
            args: [3, 30],
            msg: validationMessage.mustBe3to30Long,
          },
        },
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Role",
      tableName: "roles",
    }
  );
  return Role;
};
