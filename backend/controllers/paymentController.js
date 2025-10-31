const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");

// @desc Get all payments
// @route GET /api/payments
// @access Private
const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user.id });
  res.json(payments);
});

// @desc Create new payment
// @route POST /api/payments
// @access Private
const createPayment = asyncHandler(async (req, res) => {
  const { loanName, amountPaid, paymentDate } = req.body;

  if (!loanName || !amountPaid || !paymentDate) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const payment = await Payment.create({
    user: req.user.id,
    loanName,
    amountPaid,
    paymentDate,
  });

  res.status(201).json(payment);
});

// @desc Get payment by ID
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  res.json(payment);
});

// @desc Update payment
const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  if (payment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// @desc Delete payment
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  if (payment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await payment.deleteOne();
  res.json({ message: "Payment removed" });
});

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
