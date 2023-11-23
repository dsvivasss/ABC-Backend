const {
    Router
} = require("express");
const {
    create,
    retrieveProjectsFromCompany,
    retrieveProjectsFromUser,
    healthCheck,
    selectCandidate,
    assignCandidate,
    retrieveAssignedCandidates,
    retrieveSelectedCandidates
} = require("../controllers/project.js");

const router = Router();

router.post("/projects", create);
router.get("/projects/ping", healthCheck);
router.get("/projects/companies/:company_id", retrieveProjectsFromCompany);
router.get("/projects/users/:user_id", retrieveProjectsFromUser);
router.post("/projects/:project_id/selectcandidates/:candidate_id", selectCandidate);
router.post("/projects/:project_id/assigncandidates/:candidate_id", assignCandidate);
router.get("/projects/:project_id/assignedcandidates", retrieveAssignedCandidates);
router.get("/projects/:project_id/selectedcandidates", retrieveSelectedCandidates);

module.exports = router;