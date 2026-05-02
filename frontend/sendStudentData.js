const API_URL = "http://localhost:3000/api/v1/students/admin-add-result";
const getResultsURL = "http://localhost:3000/api/v1/students/my-own-result";

const API = "http://localhost:3000/api/v1/auth/student/register";
const ApiLoginStudent = "http://localhost:3000/api/v1/auth/student/login";
const ApiLoginAdmin = "http://localhost:3000/api/v1/auth/admin/login";

// 🔹 Save token
function setToken(token) {
  localStorage.setItem("token", token);
}

// 🔹 Get token
function getToken() {
  return localStorage.getItem("token");
}

// 🔹 Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}


// ==========================
// 🔐 AUTH
// ==========================

// STUDENT REGISTER
async function registerStudent() {
  const studentName = document.getElementById("register-name").value;
  const matricNumber = document.getElementById("register-matric").value;
  const password = document.getElementById("register-password").value;

  const res = await fetch(API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ studentName, matricNumber, password })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.message);

  setToken(data.token);
  window.location.href = "dashboard.html";
}


// STUDENT LOGIN
async function loginStudent() {
  const matricNumber = document.getElementById("student-matric").value;
  const password = document.getElementById("student-password").value;

  const res = await fetch(ApiLoginStudent, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ matricNumber, password })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.message);

  setToken(data.token);
  window.location.href = "dashboard.html";
}


// ADMIN LOGIN
async function loginAdmin() {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  const res = await fetch(ApiLoginAdmin, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) return alert(data.message);

  setToken(data.token);
  window.location.href = "admin.html";
}


// Add student
async function addStudent() {
    const studentName = document.getElementById("adminadd-name").value;
    const matricNumber = document.getElementById("adminadd-matric").value;
    const level = document.getElementById("adminadd-level").value;

    const metaPhysics = document.getElementById("adminadd-metaphysics").value;
    const epistemology = document.getElementById("adminadd-epistemology").value;
    const psychology = document.getElementById("adminadd-psychology").value;


    // Add grade function
    function getGrade(score) {
        if (score >= 70) return "A";
        if (score >= 60) return "B";
        if (score >= 50) return "C";
        if (score >= 45) return "D";
        return "F"
    }

    const StudentData = {
        studentName,
        matricNumber,
        level,
        results: [ // match backend schema
            { name: "Metaphysics", score: Number(metaPhysics), grade: getGrade(Number(metaPhysics)) },
            { name: "Epistemology", score: Number(epistemology), grade: getGrade(Number(epistemology)) },
            { name: "Psychology", score: Number(psychology), grade: getGrade(Number(psychology)) }
        ]
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}` // getToken should retrieve the token from localStorage or cookies
            },
            body: JSON.stringify(StudentData)
        });
        if (!res.ok) {
            const errorData = await res.json();
            alert("Error: " + (errorData.message || "Failed to add student"));
            return;
        }
        const data = await res.json();
        alert(data.message || "Student added successfully!");
    } catch (error) {
        alert("Network or server error: " + error.message);
        console.error(error);
    }


}

// Get all students
async function getStudents() {
    try {
        const res = await fetch(getResultsURL, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        if (!res.ok) {
            const errorData = await res.json();
            alert("Error: " + (errorData.message || "Failed to load students"));
            return;
        }
        const data = await res.json();
        // If backend returns { message, allstudents }, use allstudents
        const students = Array.isArray(data) ? data : data.allstudents || [];

        const list = document.getElementById("studentsList");
        list.innerHTML = "";

        if (!students.length) {
            list.innerHTML = "<li>No students found.</li>";
            return;
        }

        students.forEach(student => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${student.studentName}</strong> (${student.matricNumber}) - ${student.level}<br>
                ${student.results.map(r => `${r.name}: ${r.score} (${r.grade})`).join("<br>")}
                <hr>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        alert("Network or server error: " + err.message);
        console.error(err);
    }

};

// ==========================
// 🎓 STUDENT DASHBOARD
// ==========================

async function loadMyResult() {
  const res = await fetch(getResultsURL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  const data = await res.json();
  if (!res.ok || !data.studentResult) {
    document.getElementById("result").innerHTML = `<span style='color:red'>${data.message || "Could not load result."}</span>`;
    return;
  }
  const student = data.studentResult;
  document.getElementById("result").innerHTML = `
    <h3>${student.studentName}</h3>
    ${student.results.map(r => `${r.name}: ${r.score} (${r.grade})`).join("<br>")}
  `;
}
