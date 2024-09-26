"use strict";

module.exports = {
  async up(queryInterface, ) {
    await queryInterface.addConstraint("playlists", {
      fields: ["user_id", "playlist_name"],
      type: "unique",
      name: "unique_playlist_per_user"
    });
  },

  async down(queryInterface, ) {
    await queryInterface.removeConstraint("playlists", "unique_playlist_per_user");
  },
};
