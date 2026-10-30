import { useState } from "react";
import DashboardShell from "../components/DashboardShell";
import Field from "../components/Field";
import Toast from "../components/Toast";
import { api } from "../services/api";

export default function HOD({ user, onLogout }) {
    const [active, setActive] = useState("overview");
    const [toast, setToast] = useState(null);
    const [session, setSession] = useState({
        academicYear: "",
        semester: 1,
        regulationVersion: "",
        gradingPolicyVersion: ""
    });
    const [department, setDepartment] = useState({ code: "", name: "" });
    const [subject, setSubject] = useState({
        departmentCode: "",
        subjectCode: "",
        subjectName: "",
        credits: 4
    });
    const [enrollment, setEnrollment] = useState({
        classCode: "",
        subjectId: "",
        sessionId: ""
    });
    const [assignment, setAssignment] = useState({
        facultyId: "",
        subjectId: "",
        academicYear: "",
        semester: 1,
        semesterType: "ODD",
        classCode: ""
    });

    const nav = [
        { key: "overview", label: "Dashboard", icon: "⌂" },
        { key: "session", label: "Academic Session", icon: "◷" },
        { key: "department", label: "Add Department", icon: "▦" },
        { key: "subject", label: "Add Subject", icon: "◈" },
        { key: "enrollment", label: "Subject Enrollment", icon: "✓" },
        { key: "assignment", label: "Faculty Assignment", icon: "⇄" },
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
            title="HOD"
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
                        <span className="eyebrow">Department Administration</span>
                        <h2>HOD Dashboard</h2>
                        <p>
                            Manage academic sessions, departments, subjects, student enrollment and faculty assignments.
                        </p>
                    </div>
                    <div className="hero-icon">🏛️</div>
                </div>
            )}

            {active === "session" && (
                <FormPanel
                    title="Add Academic Session"
                    endpoint="POST /api/hod/academic/addAcademicSession"
                    onSubmit={() =>
                        action(
                            () => api.hod.addAcademicSession(session),
                            "Academic session created successfully."
                        )
                    }
                >
                    <div className="form-grid">
                        <Field
                            label="Academic Year"
                            value={session.academicYear}
                            onChange={e => setSession({ ...session, academicYear: e.target.value })}
                            placeholder="2026-27"
                        />
                        <Field
                            label="Semester"
                            type="number"
                            min="1"
                            value={session.semester}
                            onChange={e => setSession({ ...session, semester: e.target.value })}
                        />
                        <Field
                            label="Regulation Version"
                            value={session.regulationVersion}
                            onChange={e => setSession({ ...session, regulationVersion: e.target.value })}
                            placeholder="R2023"
                        />
                        <Field
                            label="Grading Policy Version"
                            value={session.gradingPolicyVersion}
                            onChange={e => setSession({ ...session, gradingPolicyVersion: e.target.value })}
                            placeholder="GP1"
                        />
                    </div>
                </FormPanel>
            )}

            {active === "department" && (
                <FormPanel
                    title="Add Department"
                    endpoint="POST /api/hod/departments/addDepartment"
                    onSubmit={() =>
                        action(
                            () => api.hod.addDepartment(department),
                            "Department created successfully."
                        )
                    }
                >
                    <div className="form-grid">
                        <Field
                            label="Department Code"
                            value={department.code}
                            onChange={e => setDepartment({ ...department, code: e.target.value })}
                            placeholder="CSE"
                        />
                        <Field
                            label="Department Name"
                            value={department.name}
                            onChange={e => setDepartment({ ...department, name: e.target.value })}
                            placeholder="Computer Science and Engineering"
                        />
                    </div>
                </FormPanel>
            )}

            {active === "subject" && (
                <FormPanel
                    title="Add Subject"
                    endpoint="POST /api/hod/subjects/addSubject"
                    onSubmit={() =>
                        action(
                            () => api.hod.addSubject(subject),
                            "Subject created successfully."
                        )
                    }
                >
                    <div className="form-grid">
                        <Field
                            label="Department Code"
                            value={subject.departmentCode}
                            onChange={e => setSubject({ ...subject, departmentCode: e.target.value })}
                            placeholder="CSE"
                        />
                        <Field
                            label="Subject Code"
                            value={subject.subjectCode}
                            onChange={e => setSubject({ ...subject, subjectCode: e.target.value })}
                            placeholder="CS301"
                        />
                        <Field
                            label="Subject Name"
                            value={subject.subjectName}
                            onChange={e => setSubject({ ...subject, subjectName: e.target.value })}
                            placeholder="Database Management Systems"
                        />
                        <Field
                            label="Credits"
                            type="number"
                            value={subject.credits}
                            onChange={e => setSubject({ ...subject, credits: e.target.value })}
                        />
                    </div>
                </FormPanel>
            )}

            {active === "enrollment" && (
                <FormPanel
                    title="Subject Enrollment"
                    endpoint="POST /api/hod/subject_enrollments/assign"
                    onSubmit={() =>
                        action(
                            () => api.hod.enrollStudents(enrollment),
                            "Students enrolled successfully."
                        )
                    }
                >
                    <div className="form-grid">
                        <Field
                            label="Class Code"
                            value={enrollment.classCode}
                            onChange={e => setEnrollment({ ...enrollment, classCode: e.target.value })}
                            placeholder="CSE-A"
                        />
                        <Field
                            label="Subject ID"
                            value={enrollment.subjectId}
                            onChange={e => setEnrollment({ ...enrollment, subjectId: e.target.value })}
                            placeholder="UUID"
                        />
                        <Field
                            label="Session ID"
                            value={enrollment.sessionId}
                            onChange={e => setEnrollment({ ...enrollment, sessionId: e.target.value })}
                            placeholder="UUID"
                        />
                    </div>
                </FormPanel>
            )}

            {active === "assignment" && (
                <FormPanel
                    title="Faculty Assignment"
                    endpoint="POST /api/hod/assign-faculty"
                    onSubmit={() =>
                        action(
                            () => api.hod.assignFaculty({
                                userId: user.userId,
                                body: assignment
                            }),
                            "Faculty assigned successfully."
                        )
                    }
                >
                    <div className="notice">
                        The API requires <strong>X-USER-ID</strong>. This frontend sends the authenticated HOD's userId automatically.
                    </div>

                    <div className="form-grid">
                        <Field
                            label="Faculty ID"
                            value={assignment.facultyId}
                            onChange={e => setAssignment({ ...assignment, facultyId: e.target.value })}
                            placeholder="UUID"
                        />
                        <Field
                            label="Subject ID"
                            value={assignment.subjectId}
                            onChange={e => setAssignment({ ...assignment, subjectId: e.target.value })}
                            placeholder="UUID"
                        />
                        <Field
                            label="Academic Year"
                            value={assignment.academicYear}
                            onChange={e => setAssignment({ ...assignment, academicYear: e.target.value })}
                            placeholder="2026-27"
                        />
                        <Field
                            label="Semester"
                            type="number"
                            value={assignment.semester}
                            onChange={e => setAssignment({ ...assignment, semester: e.target.value })}
                        />
                        <label className="field">
                            <span>Semester Type</span>
                            <select
                                value={assignment.semesterType}
                                onChange={e => setAssignment({ ...assignment, semesterType: e.target.value })}
                            >
                                <option>ODD</option>
                                <option>EVEN</option>
                            </select>
                        </label>
                        <Field
                            label="Class Code"
                            value={assignment.classCode}
                            onChange={e => setAssignment({ ...assignment, classCode: e.target.value })}
                            placeholder="CSE-A"
                        />
                    </div>
                </FormPanel>
            )}
        </DashboardShell>
    );
}

function FormPanel({ title, endpoint, onSubmit, children }) {
    return (
        <div className="panel">
            <div className="panel-head">
                <div>
                    <h2>{title}</h2>
                    <p>{endpoint}</p>
                </div>
            </div>

            {children}

            <button className="primary" onClick={onSubmit}>
                Submit
            </button>
        </div>
    );
}