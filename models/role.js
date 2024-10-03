"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.Playlist, {
        through: "RolePermissions",
        foreignKey: "role_id",
      });
      //   Role.belongsTo(models.User, {
      //     foreignKey: "creator_id",
      //   });
      //   Role.belongsToMany(models.Genre, {
      //     through: "song_genres",
      //     foreignKey: "song_id",
      //     otherKey: "genre_id",
      //   });
    }
  }
  Role.init(
    {
      role_name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      //   creator_id: {
      //     type: DataTypes.INTEGER,
      //     references: {
      //       model: "users",
      //       key: "id",
      //     },
      //   },
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
