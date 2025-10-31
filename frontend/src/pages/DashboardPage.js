import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const DashboardPage = () => {
  const userName = localStorage.getItem("userName") || "User";
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    loanName: "",
    amount: "",
    interestRate: "",
    startDate: "",
    dueDate: "",
  });

  const COLORS = ["#5A4BD1", "#FF7A59", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoans(res.data);
    } catch (err) {
      console.error("Error fetching loans:", err);
    }
  };

  const handleAddLoan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.post("/loans", newLoan, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewLoan({
        loanName: "",
        amount: "",
        interestRate: "",
        startDate: "",
        dueDate: "",
      });
      fetchLoans();
    } catch (err) {
      console.error("Error adding loan:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/loans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLoans();
    } catch (err) {
      console.error("Error deleting loan:", err);
    }
  };

  // Chart Data
  const pieData = loans.map((loan) => ({
    name: loan.loanName,
    value: loan.amount,
  }));

  const lineData = loans.map((loan) => ({
    name: loan.loanName,
    amount: loan.amount,
  }));

  // Loan Summary
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((acc, loan) => acc + Number(loan.amount), 0);
  const avgInterest =
    totalLoans > 0
      ? (
          loans.reduce((acc, loan) => acc + Number(loan.interestRate), 0) /
          totalLoans
        ).toFixed(2)
      : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)",
        p: 4,
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            sx={{ bgcolor: "#5A4BD1", width: 56, height: 56, mr: 2 }}
            alt={userName}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Welcome back, {userName}! 👋
            </Typography>
            <Typography color="textSecondary">
              Track and manage your student loans efficiently.
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {[
          { title: "Total Loans", value: totalLoans },
          { title: "Total Amount", value: `₹${totalAmount.toLocaleString()}` },
          { title: "Average Interest", value: `${avgInterest}%` },
        ].map((item, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Add Loan Form */}
      <Card
        sx={{
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          mb: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <AddCircleOutlineIcon sx={{ mr: 1, color: "#5A4BD1" }} /> Add New Loan
        </Typography>
        <Box component="form" onSubmit={handleAddLoan} display="flex" flexWrap="wrap" gap={2}>
          <TextField
            label="Loan Name"
            value={newLoan.loanName}
            onChange={(e) => setNewLoan({ ...newLoan, loanName: e.target.value })}
            required
          />
          <TextField
            label="Amount"
            type="number"
            value={newLoan.amount}
            onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
            required
          />
          <TextField
            label="Interest Rate (%)"
            type="number"
            value={newLoan.interestRate}
            onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
            required
          />
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newLoan.startDate}
            onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
            required
          />
          <TextField
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newLoan.dueDate}
            onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#5A4BD1", borderRadius: 3, px: 4 }}
          >
            Add Loan
          </Button>
        </Box>
      </Card>

      {/* Loan Table */}
      <Card
        sx={{
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          mb: 4,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center" }}
        >
          <AccountBalanceIcon sx={{ mr: 1, color: "#5A4BD1" }} /> Your Loans
        </Typography>
        {loans.length === 0 ? (
          <Typography>No loans added yet.</Typography>
        ) : (
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Interest</th>
                <th>Start</th>
                <th>Due</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td>{loan.loanName}</td>
                  <td>₹{loan.amount}</td>
                  <td>{loan.interestRate}%</td>
                  <td>{new Date(loan.startDate).toLocaleDateString()}</td>
                  <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                  <td>
                    <IconButton color="error" onClick={() => handleDelete(loan._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Charts Section */}
      {loans.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 6,
          }}
        >
          <Grid
            container
            spacing={4}
            justifyContent="space-around"
            alignItems="stretch"
            sx={{
              width: "90%",
              maxWidth: "1600px",
            }}
          >
            {/* Line Chart */}
            <Grid item xs={12} md={6} lg={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  p: 4,
                  minHeight: "450px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" mb={2}>
                  📈 Loan Amount Trend
                </Typography>
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#5A4BD1"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} md={6} lg={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  p: 4,
                  minHeight: "450px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" mb={2}>
                  💰 Loan Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={360}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;
