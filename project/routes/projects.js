const {
    Router
} = require("express");
const {
    create,
    retrieveProjectsFromCompany,
    healthCheck,
    selectCandidate,
    assignCandidate,
    retrieveSelectedCandidates
} = require("../controllers/project.js");

const router = Router();

router.post("/projects", create);
router.get("/projects/ping", healthCheck);
router.get("/projects/companies/:company_id", retrieveProjectsFromCompany);
router.post("/projects/:project_id/selectcandidates/:candidate_id", selectCandidate);
router.post("/projects/:project_id/assigncandidates/:candidate_id", assignCandidate);
router.get("/projects/:project_id/selectedcandidates", retrieveSelectedCandidates);
// router.post("/projects/:project_id/assigncandidates/:candidate_id", selectCandidate);

module.exports = router;