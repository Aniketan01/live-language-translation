import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://live-language-translation-67c5.onrender.com/signup", { username, email, password });
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Signup failed");
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
