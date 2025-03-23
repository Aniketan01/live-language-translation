import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, { username, email, password });
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        alert(`Signup failed: ${error.response.data.message || "Invalid request"}`);
      } else {
        console.error("Signup Error:", error);
        alert("Signup failed: Network or server issue.");
      }
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          className="form-control mb-2" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required
        />

        <input 
          type="email" 
          className="form-control mb-2" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />

        <div className="input-group mb-2">
          <input 
            type={showPassword ? "text" : "password"} 
            className="form-control" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button 
            type="button" 
            className="btn btn-outline-secondary" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="btn btn-success w-100">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
