const {
    Router
} = require("express");
const {
    submit_test,
} = require("../controllers/submission.js");

const router = Router();

router.post("/submissions", submit_test);
// router.put("/submit", update_grade);

module.exports = router;