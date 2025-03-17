import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", { username, email, password });
      navigate("/login");
    } catch (error) {
      console.log(error)
      alert("Signup failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" className="form-control mb-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-success w-100">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
