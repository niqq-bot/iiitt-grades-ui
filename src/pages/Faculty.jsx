import { useState } from "react";
import DashboardShell from "../components/DashboardShell";
import Field from "../components/Field";
import Toast from "../components/Toast";
import { api } from "../services/api";

export default function Faculty({ user, onLogout }) {
    const [active, setActive] = useState("overview");
    const [toast, setToast] = useState(null);
    const [marksFile, setMarksFile] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [classCode, setClassCode] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [marks, setMarks] = useState([]);
    const [grading, setGrading] = useState(null);
    const [update, setUpdate] = useState({ markId: "", marks: "" });

    const nav = [
        { key: "overview", label: "Dashboard", icon: "⌂" },
        { key: "uploadMarks", label: "Upload Marks", icon: "↑" },
        { key: "uploadStudents", label: "Upload Students CSV", icon: "⇧" },
        { key: "viewMarks", label: "View Marks", icon: "▤" },
        { key: "grading", label: "Grading", icon: "★" },
        { key: "updateMarks", label: "Update Marks", icon: "✎" },
    ];

    const action = async (fn, success) => {
        try {
            const data = await fn();
            setToast({ type: "success", message: success });
            return data;
        } catch (e) {
            setToast({ type: "error", message: e.message });
            return null;
        }
    };

    return (
        <DashboardShell
            user={user}
            title="Faculty"
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
                        <span className="eyebrow">Faculty Workspace</span>
                        <h2>Faculty Dashboard</h2>
                        <p>
                            Upload student data, enter marks, view marks and generate grading results.
                        </p>
                    </div>
                    <div className="hero-icon">📊</div>
                </div>
            )}

            {active === "uploadMarks" && (
                <FilePanel
                    title="Upload Marks"
                    description="POST /api/faculty/marks/upload"
                    file={marksFile}
                    setFile={setMarksFile}
                    onSubmit={() =>
                        marksFile &&
                        action(
                            () => api.faculty.uploadMarks(marksFile),
                            "Marks uploaded successfully."
                        )
                    }
                />
            )}

            {active === "uploadStudents" && (
                <FilePanel
                    title="Upload Students CSV"
                    description="POST /api/faculty/internal/students/csv"
                    accept=".csv"
                    file={csvFile}
                    setFile={setCsvFile}
                    onSubmit={() =>
                        csvFile &&
                        action(
                            () => api.faculty.uploadStudentsCsv(csvFile),
                            "Students CSV uploaded successfully."
                        )
                    }
                />
            )}

            {active === "viewMarks" && (
                <div className="panel">
                    <div className="panel-head">
                        <div>
                            <h2>View Marks</h2>
                            <p>GET /api/faculty/marks/view</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <Field
                            label="Class Code"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            placeholder="CSE-A"
                        />
                        <Field
                            label="Subject Code"
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            placeholder="CS301"
                        />
                    </div>

                    <button
                        className="primary"
                        onClick={async () => {
                            const data = await action(
                                () => api.faculty.viewMarks({ classCode, subjectCode }),
                                "Marks loaded."
                            );
                            if (data) setMarks(data);
                        }}
                        disabled={!classCode || !subjectCode}
                    >
                        View Marks
                    </button>

                    {marks.length > 0 && <MarksTable marks={marks} />}
                </div>
            )}

            {active === "grading" && (
                <GradingPanel
                    classCode={classCode}
                    subjectCode={subjectCode}
                    setClassCode={setClassCode}
                    setSubjectCode={setSubjectCode}
                    grading={grading}
                    onRun={async (markTypes) => {
                        const data = await action(
                            () => api.faculty.getGrading({ classCode, subjectCode, markTypes }),
                            "Grading generated."
                        );
                        if (data) setGrading(data);
                    }}
                />
            )}

            {active === "updateMarks" && (
                <div className="panel">
                    <div className="panel-head">
                        <div>
                            <h2>Update Marks</h2>
                            <p>PUT /api/faculty/marks/update</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <Field
                            label="Mark ID"
                            value={update.markId}
                            onChange={(e) => setUpdate({ ...update, markId: e.target.value })}
                            placeholder="UUID"
                        />
                        <Field
                            label="Marks"
                            type="number"
                            value={update.marks}
                            onChange={(e) => setUpdate({ ...update, marks: e.target.value })}
                            placeholder="0-100"
                        />
                    </div>

                    <button
                        className="primary"
                        onClick={() =>
                            action(
                                () => api.faculty.updateMarks(update),
                                "Marks updated successfully."
                            )
                        }
                        disabled={!update.markId || update.marks === ""}
                    >
                        Update
                    </button>
                </div>
            )}
        </DashboardShell>
    );
}

function FilePanel({ title, description, accept, file, setFile, onSubmit }) {
    return (
        <div className="panel">
            <div className="panel-head">
                <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>

            <label className="file-drop">
                <span>Choose a file</span>
                <input
                    type="file"
                    accept={accept}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file && <strong>{file.name}</strong>}
            </label>

            <button className="primary" onClick={onSubmit} disabled={!file}>
                Upload
            </button>
        </div>
    );
}

function MarksTable({ marks }) {
    return (
        <div className="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Mark ID</th>
                        <th>Roll Number</th>
                        <th>Subject</th>
                        <th>Type</th>
                        <th>Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {marks.map((m, i) => (
                        <tr key={m.id || i}>
                            <td>{m.id || "—"}</td>
                            <td>{m.enrollment?.student?.rollNumber || "—"}</td>
                            <td>{m.enrollment?.subject?.subjectCode || "—"}</td>
                            <td>{m.marksType || "—"}</td>
                            <td>{m.marks ?? "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function GradingPanel({
    classCode,
    subjectCode,
    setClassCode,
    setSubjectCode,
    onRun,
    grading
}) {
    const [types, setTypes] = useState(["CT1", "CT2", "CT3"]);

    const all = [
        "CT1",
        "CT2",
        "CT3",
        "ENDSEMESTER",
        "MODELLAB",
        "ENDSEMESTERLAB",
        "INTERNAL",
        "EXTERNAL",
        "FINAL"
    ];

    const toggle = (t) =>
        setTypes(
            types.includes(t)
                ? types.filter(x => x !== t)
                : [...types, t]
        );

    return (
        <div className="panel">
            <div className="panel-head">
                <div>
                    <h2>Generate Grading</h2>
                    <p>POST /api/faculty/marks/getGrading</p>
                </div>
            </div>

            <div className="form-grid">
                <Field
                    label="Class Code"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="CSE-A"
                />
                <Field
                    label="Subject Code"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="CS301"
                />
            </div>

            <div className="chips">
                {all.map(t => (
                    <button
                        key={t}
                        className={types.includes(t) ? "chip selected" : "chip"}
                        onClick={() => toggle(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <button
                className="primary"
                onClick={() => onRun(types)}
                disabled={!classCode || !subjectCode || types.length === 0}
            >
                Generate
            </button>

            {grading && (
                <div className="grading-result">
                    <div className="stats">
                        <div>
                            <span>Mean Total</span>
                            <strong>{grading.meanTotal ?? "—"}</strong>
                        </div>
                        <div>
                            <span>Std. Deviation</span>
                            <strong>{grading.standardDeviationTotal ?? "—"}</strong>
                        </div>
                    </div>

                    <div className="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Total</th>
                                    <th>Average</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(grading.students || []).map((s, i) => (
                                    <tr key={s.studentId || i}>
                                        <td>{s.rollNumber}</td>
                                        <td>{s.total}</td>
                                        <td>{s.average}</td>
                                        <td>
                                            <span className="grade-pill">{s.grade}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}