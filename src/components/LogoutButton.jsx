import { api } from "../services/api";

export default function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      onLogout?.();
    }
  };

  return <button className="logout-button" onClick={handleLogout}>Logout</button>;
}
