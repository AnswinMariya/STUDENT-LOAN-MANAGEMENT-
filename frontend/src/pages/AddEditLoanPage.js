import { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const AddEditLoanPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState({
        lenderName: "",
        principalAmount: "",
        interestRate: "",
        startDate: "",
        loanTermMonths: "",
        status: "active"
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            const fetchLoan = async () => {
                try {
                    const { data } = await API.get(`/loans/${id}`);
                    setLoan({ ...data, startDate: data.startDate.split("T")[0] });
                } catch (err) {
                    setError("Failed to fetch loan details");
                }
            };
            fetchLoan();
        }
    }, [id]);

    const handleChange = e => setLoan({ ...loan, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await API.put(`/loans/${id}`, loan);
            } else {
                await API.post("/loans", loan);
            }
            navigate("/loans");
        } catch (err) {
            setError(err.response?.data?.message || "Error saving loan");
        }
    };

    return (
        <>
            <Navbar />
            <Container className="mt-4" style={{ maxWidth: "600px" }}>
                <h2>{id ? "Edit Loan" : "Add Loan"}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Lender Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lenderName"
                            value={loan.lenderName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Principal Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="principalAmount"
                            value={loan.principalAmount}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Interest Rate (%)</Form.Label>
                        <Form.Control
                            type="number"
                            name="interestRate"
                            value={loan.interestRate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="startDate"
                            value={loan.startDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Loan Term (Months)</Form.Label>
                        <Form.Control
                            type="number"
                            name="loanTermMonths"
                            value={loan.loanTermMonths}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={loan.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {id ? "Update Loan" : "Add Loan"}
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default AddEditLoanPage;
