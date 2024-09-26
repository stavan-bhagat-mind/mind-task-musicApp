"use strict";

"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn(
      "PlaylistSongs",
      "createdAd",
      "createdAt"
    );
  },

  async down(queryInterface) {
    await queryInterface.renameColumn(
      "PlaylistSongs",
      "createdAt",
      "createdAd"
    );
  },
};
