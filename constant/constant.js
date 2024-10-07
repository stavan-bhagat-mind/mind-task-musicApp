// statusCodes.js

const http = {
  OK: { code: 200, message: "OK" },
  CREATED: { code: 201, message: "Created" },
  ACCEPTED: { code: 202, message: "Accepted" },
  NO_CONTENT: { code: 204, message: "No Content" },

  MOVED_PERMANENTLY: { code: 301, message: "Moved Permanently" },
  FOUND: { code: 302, message: "Found" },

  NOT_MODIFIED: { code: 304, message: "Not Modified" },

  BAD_REQUEST: { code: 400, message: "Bad Request" },
  UNAUTHORIZED: { code: 401, message: "Unauthorized" },
  FORBIDDEN: { code: 403, message: "Forbidden, do not have access" },
  NOT_FOUND: { code: 404, message: "Not Found" },

  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error" },
  NOT_IMPLEMENTED: { code: 501, message: "Not Implemented" },
  BAD_GATEWAY: { code: 502, message: "Bad Gateway" },
  SERVICE_UNAVAILABLE: { code: 503, message: "Service Unavailable" },
};

const errors = {
  TOKEN_NOT_PROVIDED: "No auth token provided!",
  TOKEN_EXPIRE: "token expired ",
  INVALID_TOKEN: "invalid token",
};
const messages = {
  REMOVED: "removed successfully.",
  UPDATED: "updated successfully.",
};
const baseURL = `http://localhost:${process.env.PORT}/`;
const validationMessage = {
  OnlyLettersNumbersUnderscores:
    "Permission name can only contain letters, numbers, and underscores, with no spaces.",
  mustBe3to30Long: "Permission name must be between 3 and 30 characters long.",
};
const role = {
  admin: "admin",
  user: "user",
  subAdmin: "sub_admin",
};

const permissions = {
  addSong: "ADD_SONG",
  updateSong: "UPDATE_SONG",
  deleteSong: "DELETE_SONG",
  addGenre: "ADD_GENRE",
  getUserData: "GET_USER",
  getUserRecommendation: "GET_USER_RECOMMENDATION",
  getUserGenrePercentage: "GET_USER_GENRE_PERCENTAGE",
  updateUserData: "UPDATE_USER",
  deleteUserData: "DELETE_USER",
  deleteUserHistory: "DELETE_USER_HISTORY",
};
module.exports = {
  salt: 10,
  http,
  errors,
  messages,
  role,
  permissions,
  baseURL,
  validationMessage,
};
