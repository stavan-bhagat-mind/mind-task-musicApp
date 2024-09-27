
"use strict";

module.exports = {
  up(queryInterface) {
    return Promise.all([queryInterface.removeColumn("songs", "meta")]);
  },

  down(queryInterface) {
    // return Promise.all([queryInterface.removeColumn("users", "creator_id")]);
  },
};

