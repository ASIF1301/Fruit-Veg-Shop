// cart.js
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-container');
  if (!cart || cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty. <a href="products.html">Shop products</a></p>';
    return;
  }

  let html = `<table class="table">
    <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead><tbody>`;
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * (item.qty || 1);
    total += subtotal;
    html += `<tr>
      <td>${item.name}</td>
      <td>₹${Number(item.price).toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, -1)">-</button>
        <span class="mx-2">${item.qty}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, 1)">+</button>
      </td>
      <td>₹${Number(subtotal).toFixed(2)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">Remove</button></td>
    </tr>`;
  });

  html += `</tbody></table>
    <div class="d-flex justify-content-between align-items-center">
      <h4>Total: ₹${Number(total).toFixed(2)}</h4>
      <div>
        <a href="products.html" class="btn btn-secondary me-2">Continue shopping</a>
        <a href="checkout.html" class="btn btn-primary">Checkout</a>
      </div>
    </div>`;

  container.innerHTML = html;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = (item.qty || 1) + delta;
  if (item.qty <= 0) {
    // remove
    const idx = cart.findIndex(i => i.id === id);
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx >= 0) {
    cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
  }
}

function updateCartCount() {
  const cart = getCart();
  const qty = cart.reduce((s,i)=>s+(i.qty||1),0);
  const els = document.querySelectorAll('#cart-count');
  els.forEach(e => e.textContent = qty);
}
