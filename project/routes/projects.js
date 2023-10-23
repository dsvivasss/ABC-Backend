const {
    Router
} = require("express");
const {
    create,
    healthCheck
} = require("../controllers/project.js");

const router = Router();

router.post("/projects", create);
router.get("/projects/ping", healthCheck);

module.exports = router;