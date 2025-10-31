import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "../App.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/register", { name, email, password });

      localStorage.setItem("token", data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      localStorage.setItem("userName", data.name);

      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>📝 Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <FaUser size={18} color="#5a4bd1" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <FaEnvelope size={18} color="#5a4bd1" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <FaLock size={18} color="#5a4bd1" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-auth">Register</button>
        </form>
        <p className="register-link">
          Already have an account? <span onClick={() => navigate("/login")} className="link">Login</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
