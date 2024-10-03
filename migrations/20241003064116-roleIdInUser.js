"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "role_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "roles",
        key: "id",
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("users", "role_id");
  },
};
