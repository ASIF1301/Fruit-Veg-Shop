function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);

        if (data === "Registration successful") {
            window.location.href = "login.html";
        }
    });
}

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json().catch(() => res.text()))
    .then(data => {

        // 🔥 If backend returns error string
        if (typeof data === "string") {
            alert(data); // "Invalid password" / "User not found"
            return;
        }

        // ✅ Success case
        alert("Login successful 🎉");

        localStorage.setItem("currentUser", JSON.stringify(data));

        window.location.href = "index.html";
    })
    .catch(err => {
        console.error(err);
        alert("Something went wrong ❌");
    });
}

function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out 👋");
    window.location.href = "login.html";
}