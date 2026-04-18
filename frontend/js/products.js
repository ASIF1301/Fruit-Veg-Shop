fetch("http://localhost:8080/api/products")
    .then(response => response.json())
    .then(products => {
        const container = document.getElementById("product-container");

        if (!container) return;

        products.forEach(product => {
            const card = `
                <div class="product-card">
                    <img src="${product.imageUrl}" />
                    <h3>${product.name}</h3>
                    <p>₹${product.price}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
            container.innerHTML += card;
        });
    })
    .catch(error => console.error("Error:", error));