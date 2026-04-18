function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function addToCart(productId) {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("Please login first");
        return;
    }

    fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userEmail: user.email,
            productId: productId,
            quantity: 1
        })
    })
    .then(res => res.text())
    .then(data => alert(data));
}

// DEBUG: check if function is loaded
console.log("cart.js loaded ✅");

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(id) {
    fetch(`http://localhost:8080/api/cart/${id}`, {
        method: "DELETE"
    }).then(() => renderCart());
}

function renderCart() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const container = document.getElementById("cart-container");
    const totalElement = document.getElementById("total-price");

    if (!user) return;

    // 🔥 Fetch both cart + products
    Promise.all([
        fetch(`http://localhost:8080/api/cart/${user.email}`).then(res => res.json()),
        fetch("http://localhost:8080/api/products").then(res => res.json())
    ])
    .then(([cart, products]) => {

        container.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);

            if (!product) return;

            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            const div = document.createElement("div");
            div.classList.add("product-card");

            div.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: ₹${product.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Total: ₹${itemTotal}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;

            container.appendChild(div);
        });

        totalElement.innerText = "Total Price: ₹" + total;
    });
}

function goToCheckout() {
    window.location.href = "checkout.html";
}

function checkout() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    Promise.all([
        fetch(`http://localhost:8080/api/cart/${user.email}`).then(res => res.json()),
        fetch("http://localhost:8080/api/products").then(res => res.json())
    ])
    .then(([cart, products]) => {

        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            total += product.price * item.quantity;
        });

        fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userEmail: user.email,
                items: JSON.stringify(cart),
                totalPrice: total
            })
        })
        .then(res => res.text())
        .then(() => {
            alert("Order placed 🎉");

            fetch(`http://localhost:8080/api/cart/clear/${user.email}`, {
                method: "DELETE"
            }).then(() => {
                window.location.href = "index.html";
            });
        });
    });
}

// Auto render when page loads
renderCart();