const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem("accessToken");

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  refresh: () => request("/api/auth/refresh", { method: "POST" }),
  accessDenied: () => request("/api/auth/accessDenied"),

  faculty: {
    uploadMarks: (file) => {
      const body = new FormData();
      body.append("file", file);
      return request("/api/faculty/marks/upload", { method: "POST", body });
    },
    uploadStudentsCsv: (file) => {
      const body = new FormData();
      body.append("file", file);
      return request("/api/faculty/internal/students/csv", { method: "POST", body });
    },
    viewMarks: ({ classCode, subjectCode }) =>
      request(`/api/faculty/marks/view?classCode=${encodeURIComponent(classCode)}&subjectCode=${encodeURIComponent(subjectCode)}`),
    updateMarks: ({ markId, marks }) =>
      request("/api/faculty/marks/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markId, marks: Number(marks) }),
      }),
    getGrading: ({ classCode, subjectCode, markTypes }) =>
      request("/api/faculty/marks/getGrading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classCode, subjectCode, markTypes }),
      }),
  },

  hod: {
    addAcademicSession: (body) =>
      request("/api/hod/academic/addAcademicSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear: body.academicYear,
          semester: Number(body.semester),
          regulationVersion: body.regulationVersion,
          gradingPolicyVersion: body.gradingPolicyVersion,
        }),
      }),
    addDepartment: (body) =>
      request("/api/hod/departments/addDepartment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    addSubject: (body) =>
      request("/api/hod/subjects/addSubject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    enrollStudents: (body) =>
      request("/api/hod/subject_enrollments/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classCode: body.classCode,
          subjectId: body.subjectId,
          sessionId: body.sessionId,
        }),
      }),
    assignFaculty: ({ userId, body }) =>
      request("/api/hod/assign-faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId,
        },
        body: JSON.stringify(body),
      }),
  },

  student: {
    view: () => request("/student/view"),
    getResult: (rollNo) => request(`/student/result/${encodeURIComponent(rollNo)}`),
  },
};

export { API_BASE_URL };
