import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Student from "./pages/Student";
import Faculty from "./pages/Faculty";
import HOD from "./pages/HOD";
import Loading from "./components/Loading";
import { api } from "./services/api";
import "./styles/app.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await api.me();
      setUser(data?.authenticated ? data : null);
    } catch (error) {
      console.log("Not authenticated:", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  if (loading) return <Loading text="Checking authentication..." />;
  if (!user) return <Login />;

  switch (user.role) {
    case "ROLE_STUDENT": return <Student user={user} onLogout={() => setUser(null)} />;
    case "ROLE_FACULTY": return <Faculty user={user} onLogout={() => setUser(null)} />;
    case "ROLE_HOD": return <HOD user={user} onLogout={() => setUser(null)} />;
    default: return <div className="error-screen"><h2>Unsupported role</h2><p>{user.role}</p><button onClick={() => setUser(null)}>Back to Login</button></div>;
  }
}

export default App;
