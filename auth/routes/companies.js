const {
    Router
} = require("express");
const {
    register,
    login,
    retrieveCompany,
    healthCheck
} = require("../controllers/company.js");

const router = Router();

router.post("/companies", register);
router.post("/companies/auth", login);
router.get("/companies/me", retrieveCompany);
router.get("/companies/ping", healthCheck);

module.exports = router;