import './Login.css'

function Login() {
  

    return (
        <>
            
            <div className="main">

              <div className="login">

                {/* College Logo */}
                <img
                  className="college-logo"
                  src="./src/assets/iiitt-logo.png"
                  alt="College Logo"
                />

                {/* Heading */}
                <h1>Welcome back</h1>

                {/* Google Login */}
                <div className="google-login">
                  <img
                    src="./src/assets/google.png"
                    alt="Google"
                  />
                  <span>Continue with Google</span>
                </div>

                {/* Divider */}
                <div className="divider">
                  <span>or</span>
                </div>

                {/* Username */}
                <input
                  type="email"
                  placeholder="Enter email or username"
                />

                {/* Continue */}
                <button className="login-button">
                  Continue
                </button>

              </div>

            </div>
            
        </>
    );
}

export default Login


