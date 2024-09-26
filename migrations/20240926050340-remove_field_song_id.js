"use strict";

// Example migration to remove songs_id
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn("playlists", "songs_id");
  },
  async down(queryInterface,Sequelize) {
    await queryInterface.addColumn("playlists", "songs_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "songs",
        key: "id",
      },
    });
  },
};
