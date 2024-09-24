"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("songs", "creator_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([queryInterface.removeColumn("songs", "creator_id")]);
  },
};

