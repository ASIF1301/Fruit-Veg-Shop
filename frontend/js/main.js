function goToProducts() {
    window.location.href = "products.html";
}

function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const authLink = document.getElementById("auth-link");

    if (!authLink) return;

    if (user) {
        authLink.innerHTML = `
    <span style="margin-right:10px;">Hi, ${user.name || user.email}</span>
    <a href="#" onclick="logout()">Logout</a>
`;
    } else {
        authLink.innerHTML = `<a href="login.html">Login</a>`;
    }
}

updateNavbar();