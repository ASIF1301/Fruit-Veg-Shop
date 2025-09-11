// products.js
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  updateCartCount();
});

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    localStorage.setItem('products_cache', JSON.stringify(products)); // cache for cart usage
    const container = document.getElementById('products-list');
    container.innerHTML = '';

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'col-md-3 mb-4';
      card.innerHTML = `
        <div class="card h-100">
          <img src="${p.image}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">₹${Number(p.price).toFixed(2)}</p>
            <button class="btn btn-primary mt-auto" onclick="addToCart(${p.id})">Add to cart</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load products', err);
    document.getElementById('products-list').textContent = 'Failed to load products.';
  }
}

function addToCart(productId) {
  const products = JSON.parse(localStorage.getItem('products_cache') || '[]');
  const product = products.find(p => p.id === productId);
  if (!product) return alert('Product not found (try reloading).');

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Added to cart');
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const qty = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const els = document.querySelectorAll('#cart-count');
  els.forEach(e => e.textContent = qty);
}
