const {
    Router
} = require("express");
const {
    register,
    login,
    retrieveUser,
    filter_users,
    healthCheck
} = require("../controllers/user.js");

const router = Router();

router.post("/users", register);
router.post("/users/auth", login);
router.get("/users/me", retrieveUser);
router.get("/users/ping", healthCheck);
router.get("/users", filter_users);

module.exports = router;