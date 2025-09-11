// checkout.js
document.addEventListener('DOMContentLoaded', () => {
  renderSummary();
  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', placeOrder);
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function renderSummary() {
  const cart = getCart();
  const container = document.getElementById('order-summary');
  if (!cart || cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty. <a href="products.html">Shop products</a></p>';
    document.getElementById('checkout-form').style.display = 'none';
    return;
  }

  let html = '<ul class="list-group mb-3">';
  let total = 0;
  cart.forEach(i => {
    const sub = i.price * (i.qty || 1);
    total += sub;
    html += `<li class="list-group-item d-flex justify-content-between">
      <div>${i.name} <small class="text-muted">x ${i.qty}</small></div>
      <div>₹${Number(sub).toFixed(2)}</div>
    </li>`;
  });
  html += `</ul><h5>Total: ₹${Number(total).toFixed(2)}</h5>`;
  container.innerHTML = html;
}

async function placeOrder(e) {
  e.preventDefault();
  const cart = getCart();
  if (!cart || cart.length === 0) return alert('Cart is empty');

  const form = e.target;
  const order = {
    customer: {
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value
    },
    items: cart,
    total: cart.reduce((s,i)=>s + (i.price * (i.qty||1)), 0)
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order failed');

    // success
    localStorage.removeItem('cart');
    document.getElementById('result').innerHTML = `<div class="alert alert-success">Order placed! Order ID: ${data.orderId}</div>`;
    document.getElementById('checkout-form').reset();
    document.getElementById('checkout-form').style.display = 'none';
    renderSummary(); // will now show empty
    // update cart counts in other pages by reload or manual
  } catch (err) {
    console.error(err);
    document.getElementById('result').innerHTML = `<div class="alert alert-danger">Failed to place order: ${err.message}</div>`;
  }
}
