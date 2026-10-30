import { useState } from "react";
import collegeLogo from "../assets/iiitt-logo.png";
import googleLogo from "../assets/google.png";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img className="college-logo" src={collegeLogo} alt="College Logo" />
        <h1>Grading Portal</h1>
        <button className="google-login" onClick={googleLogin}>
          <img src={googleLogo} alt="Google" />
          <span>Continue with Google</span>
        </button>
        <div className="divider"><span>or</span></div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email or username" />
        <button className="continue-button" disabled>Continue</button>
        <small className="login-note">Google login is the active authentication method.</small>
      </div>
    </div>
  );
}
