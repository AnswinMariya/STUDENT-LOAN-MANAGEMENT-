import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import API from "../services/api";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loanName, setLoanName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  // Fetch payments from backend
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await API.get("/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const handleAddPayment = async () => {
    if (!loanName || !amountPaid || !paymentDate) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await API.post("/payments", {
        loanName,
        amountPaid,
        paymentDate,
      });

      setOpen(false);
      setLoanName("");
      setAmountPaid("");
      setPaymentDate("");
      fetchPayments();
    } catch (err) {
      console.error("Error adding payment:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9ff", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#3f3d56" }}
      >
        💳 Payment Dashboard
      </Typography>

      <Button
        variant="contained"
        sx={{
          background: "linear-gradient(to right, #667eea, #764ba2)",
          color: "#fff",
          borderRadius: "20px",
          mb: 3,
          "&:hover": { background: "linear-gradient(to right, #5a67d8, #6b46c1)" },
        }}
        onClick={() => setOpen(true)}
      >
        + Add Payment
      </Button>

      {payments.length === 0 ? (
        <Typography sx={{ mt: 2, color: "#6b6b6b" }}>
          No payments recorded yet. Add your first payment!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {payments.map((payment) => (
            <Grid item xs={12} sm={6} md={4} key={payment._id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 6px 16px rgba(0,0,0,0.15)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4a4a4a" }}>
                    {payment.loanName}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666" }}>
                    💰 Amount Paid: ₹{payment.amountPaid}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888", mt: 1 }}>
                    📅 {new Date(payment.paymentDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Payment Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#fff",
            boxShadow: 24,
            borderRadius: "16px",
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: "#3f3d56" }}>
            Add New Payment
          </Typography>

          <TextField
            label="Loan Name"
            fullWidth
            margin="normal"
            value={loanName}
            onChange={(e) => setLoanName(e.target.value)}
          />
          <TextField
            label="Amount Paid (₹)"
            fullWidth
            margin="normal"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
          <TextField
            label="Payment Date"
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              sx={{ mr: 2, borderRadius: "20px" }}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #667eea, #764ba2)",
                color: "#fff",
                borderRadius: "20px",
              }}
              onClick={handleAddPayment}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
