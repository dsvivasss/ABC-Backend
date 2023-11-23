const {
    Router
} = require("express");
const {
    create,
    retrieveTests,
    healthCheck
} = require("../controllers/tests.js");

const router = Router();

router.post("/tests", create);
router.get("/tests/projects/:project_id", retrieveTests);
router.get("/tests/ping", healthCheck);

module.exports = router;