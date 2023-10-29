const {
    Router
} = require("express");
const {
    create,
    retrieveProjectsFromCompany,
    healthCheck
} = require("../controllers/project.js");

const router = Router();

router.post("/projects", create);
router.get("/projects/ping", healthCheck);
router.get("/projects/companies/:company_id", retrieveProjectsFromCompany);

module.exports = router;