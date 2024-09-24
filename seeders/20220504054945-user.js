"use strict";
const {hashConvert} = require("../services/helpers");
module.exports = {
  async up(queryInterface) {
    const adminPassword = await hashConvert("admin@123");
    const userPassword = await hashConvert("user@123");

    await queryInterface.bulkInsert(
      "users",
      [
        {
          user_name: "admin",
          user_password: adminPassword,
          email:"admin@gmail.com",
          user_type: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_name: "user1",
          user_password: userPassword,

          email:"user1@gmail.com",
          user_type: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
