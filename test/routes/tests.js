const {
    Router
} = require("express");
const {
    populate,
    selectQuestion,
    healthCheck
} = require("../controllers/test.js");

const router = Router();

router.post("/tests/populate", populate);
router.get("/tests/questions/:topic/:difficulty_level/:option", selectQuestion);
router.get("/tests/ping", healthCheck);

module.exports = router;