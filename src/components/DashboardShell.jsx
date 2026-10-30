import LogoutButton from "./LogoutButton";

export default function DashboardShell({ user, title, navItems, active, onNavigate, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/src/assets/iiitt-logo.png" alt="IIITT" />
          <div><strong>IIITT Grades</strong><small>{title}</small></div>
        </div>
        <nav>
          {navItems.map((item) => (
            <button key={item.key} className={active === item.key ? "nav-item active" : "nav-item"} onClick={() => onNavigate(item.key)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar">{title[0]}</div>
          <div className="user-mini"><strong>{title}</strong><span>{user?.userId || "Authenticated"}</span></div>
          <LogoutButton onLogout={onLogout} />
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div><span className="eyebrow">IIITT Grades</span><h1>{navItems.find((x) => x.key === active)?.label || title}</h1></div><span className="role-badge">{user?.role}</span></header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
