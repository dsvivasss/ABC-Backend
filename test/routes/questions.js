const {
    Router
} = require("express");
const {
    populate,
    selectQuestion,
    healthCheck
} = require("../controllers/question.js");

const router = Router();

router.post("/questions/populate", populate);
router.post("/questions", selectQuestion);
router.get("/questions/ping", healthCheck);

module.exports = router;