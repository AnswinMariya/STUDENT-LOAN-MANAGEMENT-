const Loan = require("../models/Loan");
const asyncHandler = require("express-async-handler");

// ➕ Add new loan
const addLoan = asyncHandler(async (req, res) => {
  const { loanName, amount, interestRate, startDate, dueDate } = req.body;

  const loan = await Loan.create({
    user: req.user._id,
    loanName,
    amount,
    interestRate,
    startDate,
    dueDate,
  });

  res.status(201).json(loan);
});

// 📋 Get all loans of logged-in user
const getLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ user: req.user._id });
  res.json(loans);
});

// 🗑️ Delete loan
const deleteLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (loan && loan.user.toString() === req.user._id.toString()) {
    await loan.deleteOne();
    res.json({ message: "Loan deleted" });
  } else {
    res.status(404);
    throw new Error("Loan not found or unauthorized");
  }
});

module.exports = { addLoan, getLoans, deleteLoan };
