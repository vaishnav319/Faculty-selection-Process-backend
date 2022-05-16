const express = require("express");
const {
  contactUs,
  getAllForms,
  updateForm,
  deleteForm,
  getForm,
} = require("../../controllers/contact/contact.controller");
const router = express.Router();

router.post("/new", contactUs);
router.get("/all", getAllForms);
router.get("/form/:id", getForm);
router.patch("/update/:id", updateForm);
router.delete("/:id", deleteForm);

module.exports = router;
