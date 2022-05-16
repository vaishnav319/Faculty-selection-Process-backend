const express = require("express");
const router = express.Router();
const {
  getHrs,
  addHr,
  getPendingHrs,
} = require("../../controllers/dashboard/dashboard.controller");
const upload = require("../../../../middleware/multer");
const { adminprotect } = require("../../../../middleware/auth.middleware");
router.get("/hrs", adminprotect, getHrs);
router.get("/hrs/pending", adminprotect, getPendingHrs);

router.post("/add/hr", adminprotect, addHr);
module.exports = router;
