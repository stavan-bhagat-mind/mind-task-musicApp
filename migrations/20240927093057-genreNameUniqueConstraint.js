"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint("genres", {
      fields: ["genre_name"],
      type: "unique",
      name: "unique_genre_name_constraint", 
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "genres",
      "unique_genre_name_constraint"
    );
  },
};



