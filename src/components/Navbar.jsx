import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const logo="https://media-hosting.imagekit.io//9be2d58720da4897/translation-logo-mini.png?Expires=1836712265&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=C35L9XOzi8LPKdHt4mA6d4Ecf8slHmZovEgH0pQ5Gy5xSLBPSmLILBb92Vbk98~fSotp8SYA6otCCrOt--EowyX5oQ47RJKyFY6UB9ivOtZUl0qkqLTyZSHq9CD-YXF3gfEzX9kiFbveI1sh1BDbY~edCFGmw9Sh7P8BofChWkOrzlba9JkxJwQziOt-WMK3MCt~E-~20xtFLQCx1dImQquEpdRaiL0VzL-DeG-~Ng0QQpeiSHIWqXjmLU7Dc3-LbOg7MD7a-hJY8xh-9nn-xtG964CN2QBSKrQzW3VOvD9-j-HsD5uko~xNvfH1crJzX3XGrTdqb8y3VSQolCJRMw__";
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><img src={logo} width={"100px"} alt="" /></Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/text-translate">Text Translate</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="nav-link" to="/voice-translate">Voice Translate</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">{username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
