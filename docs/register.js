document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5002/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.message);
        window.location.href = "login.html"; // redirect after successful register
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Something went wrong. Please try again.");
    }
  });
});
