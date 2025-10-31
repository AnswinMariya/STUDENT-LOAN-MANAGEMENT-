import { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import API from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const LoansPage = () => {
    const [loans, setLoans] = useState([]);

    const fetchLoans = async () => {
        const { data } = await API.get("/loans");
        setLoans(data);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this loan?")){
            await API.delete(`/loans/${id}`);
            fetchLoans();
        }
    };

    useEffect(() => { fetchLoans(); }, []);

    return (
        <>
            <Navbar />
            <Container className="mt-4">
                <div className="d-flex justify-content-between mb-3">
                    <h2>All Loans</h2>
                    <Button as={Link} to="/loans/add">Add Loan</Button>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Lender</th>
                            <th>Principal</th>
                            <th>Interest Rate</th>
                            <th>Start Date</th>
                            <th>Term (Months)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map(loan => (
                            <tr key={loan._id}>
                                <td>{loan.lenderName}</td>
                                <td>${loan.principalAmount}</td>
                                <td>{loan.interestRate}%</td>
                                <td>{new Date(loan.startDate).toLocaleDateString()}</td>
                                <td>{loan.loanTermMonths}</td>
                                <td>{loan.status}</td>
                                <td>
                                    <Button as={Link} to={`/loans/edit/${loan._id}`} size="sm" className="me-2">Edit</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(loan._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default LoansPage;
