"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "email", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("users", "email");
  },
};
