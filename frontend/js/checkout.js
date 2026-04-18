function loadCheckout() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const container = document.getElementById("order-summary");
    const totalElement = document.getElementById("checkout-total");

    if (!container || !user) return;

    // 🔥 Fetch cart + products
    Promise.all([
        fetch(`http://localhost:8080/api/cart/${user.email}`).then(res => res.json()),
        fetch("http://localhost:8080/api/products").then(res => res.json())
    ])
    .then(([cart, products]) => {

        let total = 0;
        container.innerHTML = "";

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);

            if (!product) return;

            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            const div = document.createElement("div");
            div.classList.add("product-card");

            div.innerHTML = `
                <h3>${product.name}</h3>
                <p>Qty: ${item.quantity}</p>
                <p>₹${itemTotal}</p>
            `;

            container.appendChild(div);
        });

        totalElement.innerText = "Total: ₹" + total;
    });
}

function placeOrder(event) {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("Please login first");
        return;
    }

    // 🔥 Fetch cart + products again for total calculation
    Promise.all([
        fetch(`http://localhost:8080/api/cart/${user.email}`).then(res => res.json()),
        fetch("http://localhost:8080/api/products").then(res => res.json())
    ])
    .then(([cart, products]) => {

        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });

        // 🔥 Send order to backend
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
        .then(data => {
            alert(data);

            // 🔥 Clear backend cart
            fetch(`http://localhost:8080/api/cart/clear/${user.email}`, {
                method: "DELETE"
            })
            .then(() => {
                window.location.href = "index.html";
            });
        });
    });
}

// Auto load
loadCheckout();