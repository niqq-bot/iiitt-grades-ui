import { useState } from "react";
import DashboardShell from "../components/DashboardShell";
import Field from "../components/Field";
import Toast from "../components/Toast";
import { api } from "../services/api";

export default function Student({ user, onLogout }) {
    const [active, setActive] = useState("overview");
    const [rollNo, setRollNo] = useState("");
    const [result, setResult] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [toast, setToast] = useState(null);

    const run = async (fn) => {
        try {
            const data = await fn();
            return data;
        } catch (e) {
            setToast({ type: "error", message: e.message });
            return null;
        }
    };

    const nav = [
        { key: "overview", label: "Dashboard", icon: "⌂" },
        { key: "view", label: "My Details", icon: "◉" },
        { key: "result", label: "View Result", icon: "▤" },
    ];

    return (
        <DashboardShell
            user={user}
            title="Student"
            navItems={nav}
            active={active}
            onNavigate={setActive}
            onLogout={onLogout}
        >
            <Toast
                message={toast?.message}
                type={toast?.type}
                onClose={() => setToast(null)}
            />

            {active === "overview" && (
                <div className="hero-card">
                    <div>
                        <span className="eyebrow">Welcome</span>
                        <h2>Student Dashboard</h2>
                        <p>View your student information and academic results.</p>
                    </div>
                    <div className="hero-icon">🎓</div>
                </div>
            )}

            {active === "view" && (
                <div className="panel">
                    <div className="panel-head">
                        <div>
                            <h2>My Details</h2>
                            <p>Data returned by the student view API.</p>
                        </div>
                        <button
                            className="primary"
                            onClick={async () => setViewData(await run(api.student.view))}
                        >
                            Load Details
                        </button>
                    </div>

                    {viewData !== null && (
                        <pre className="json-box">
                            {typeof viewData === "string"
                                ? viewData
                                : JSON.stringify(viewData, null, 2)}
                        </pre>
                    )}
                </div>
            )}

            {active === "result" && (
                <div className="panel">
                    <div className="panel-head">
                        <div>
                            <h2>Result</h2>
                            <p>GET /student/result/{"{rollNo}"}</p>
                        </div>
                    </div>

                    <div className="inline-form">
                        <Field
                            label="Roll Number"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            placeholder="Enter roll number"
                        />
                        <button
                            className="primary"
                            onClick={async () => setResult(await run(() => api.student.getResult(rollNo)))}
                            disabled={!rollNo}
                        >
                            Get Result
                        </button>
                    </div>

                    {result && <ResultTable result={result} />}
                </div>
            )}
        </DashboardShell>
    );
}

function ResultTable({ result }) {
    return (
        <div className="result-wrap">
            <div className="result-summary">
                <div>
                    <span>Name</span>
                    <strong>{result.name || "—"}</strong>
                </div>
                <div>
                    <span>Roll Number</span>
                    <strong>{result.rollNumber ?? "—"}</strong>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {(result.subjects || []).map((s, i) => (
                        <tr key={i}>
                            <td>{s.subjectCode}</td>
                            <td>{s.subjectName}</td>
                            <td>
                                <span className="grade-pill">{s.grade}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}