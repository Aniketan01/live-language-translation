import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://live-language-translation-67c5.onrender.com/login", { email, password });
      localStorage.setItem("user", res.data.username);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
