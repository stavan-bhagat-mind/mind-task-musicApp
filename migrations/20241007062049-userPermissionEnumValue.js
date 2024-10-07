"use strict";
const { permissions } = require("../constant/constant");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("permissions", "identifier", {
      type: Sequelize.ENUM(Object.values(permissions)),
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("permissions", "identifier");
  },
};
