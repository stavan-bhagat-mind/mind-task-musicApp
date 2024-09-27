"use strict";

module.exports = {
  up(queryInterface) {
    return Promise.all([queryInterface.removeColumn("genres", "genre_name")]);
  },

  down(queryInterface) {
    // return Promise.all([queryInterface.removeColumn("users", "creator_id")]);
  },
};
