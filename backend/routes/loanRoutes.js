const express = require("express");
const router = express.Router();
const { addLoan, getLoans, deleteLoan } = require("../controllers/loanController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, addLoan).get(protect, getLoans);
router.route("/:id").delete(protect, deleteLoan);

module.exports = router;
