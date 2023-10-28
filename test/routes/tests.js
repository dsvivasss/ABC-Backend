const {
    Router
} = require("express");
const {
    create,
    healthCheck
} = require("../controllers/tests.js");

const router = Router();

router.post("/tests", create);
router.get("/tests/ping", healthCheck);

module.exports = router;