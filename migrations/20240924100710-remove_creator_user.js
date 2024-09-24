"use strict";

module.exports = {
  up(queryInterface) {
    return Promise.all([queryInterface.removeColumn("users", "creator_id")]);
  },

  down(queryInterface) {
    // return Promise.all([queryInterface.removeColumn("users", "creator_id")]);
  },
};


