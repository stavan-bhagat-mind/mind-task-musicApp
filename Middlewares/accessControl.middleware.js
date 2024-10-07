const { http, role } = require("../constant/constant");
require("dotenv").config;
const Models = require("../models/index");
const authRoleMiddleware = (roles, permission) => async (req, res, next) => {
  try {
    const user = req.authUser;
    console.log(user);
    let result;
    if (!user.user_type === role.admin) {
      const data = await Models.Permission.findAll({
        include: [
          {
            model: Models.Role,
            through: {
              attributes: [],
            },
            where: { id: user.role_id },
            attributes: [],
          },
        ],

        attributes: ["identifier"],
      });
      result = data.map((values) => {
        return values.dataValues.identifier;
      });
    }

    if (
      user.user_type === role.admin ||
      (roles.includes(user.user_type) && result.includes(permission.addGenre))
    ) {
      next();
    } else {
      res
        .status(http.FORBIDDEN.code)
        .json({ success: false, data: null, message: http.FORBIDDEN.message });
    }
  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR.code).send({
      success: false,
      data: null,
      message: http.INTERNAL_SERVER_ERROR.message,
    });
  }
};

module.exports = authRoleMiddleware;
