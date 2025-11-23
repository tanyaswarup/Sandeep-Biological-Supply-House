// cart.js

document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Extract product code (from h3 element)
        const productCode = card.querySelector('h3').textContent.trim();

        // Extract product name from paragraph with "Product Code:"
        const productNameElement = Array.from(card.querySelectorAll('p')).find(p =>
            p.textContent.includes('Product Code:'));
        const productName = productNameElement 
            ? productNameElement.textContent.replace('Product Code: ', '').trim() 
            : '';

        // Extract price (numbers only) from paragraph with "Price:"
        const priceElement = Array.from(card.querySelectorAll('p')).find(p =>
            p.textContent.includes('Price:'));
        const priceMatch = priceElement
            ? priceElement.textContent.match(/₹([\d.,]+)/)
            : null;
        const price = priceMatch ? priceMatch[1].replace(/,/g, '') : '';

        // Find the add to cart button inside the card
        const button = card.querySelector('button[onclick^="addToCart"]');

        // Update the button's onclick attribute with new parameters
        if (button && productCode && productName && price) {
            button.setAttribute('onclick',
                `addToCart('${productCode}', '${productName}', '${price}')`);
        }
    });
});





function addToCart(code, name, price) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let found = cart.find(item => item.code === code);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({code, name, price, qty: 1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(name + ' added to cart!');
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) {
    cartCountElem.textContent = cart.reduce((sum, x) => sum + x.qty, 0);
  }
}

function renderCart() {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let out = '';
  if (!cart.length) {
    out = '<div class="cart-empty">Your cart is empty.<br><a href="products.html">Browse Products</a></div>';
    document.getElementById('cart-view').innerHTML = out;
    document.getElementById('payment-section').style.display = 'none';
    return;
  }
  out += '<table id="cart-list" style="width:95%;max-width:800px;margin:0 auto 28px auto; background:#fff;border-radius:12px;box-shadow:0 3px 18px #bcd;"><thead><tr><th>Code</th><th>Name</th><th>Price (₹)</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  let total = 0;
  cart.forEach((item, i) => {
    let sub = item.price * item.qty;
    total += sub;
    out += `<tr>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>
        <input type="number" min="1" style="width:50px;" value="${item.qty}" onchange="updateQty(${i},this.value)"/>
      </td>
      <td>${sub}</td>
      <td class="cart-actions">
        <button onclick="removeItem(${i})">Remove</button>
      </td>
    </tr>`;
  });
  out += `</tbody></table>
    <div class="cart-total" style="text-align:center;">Total: ₹${total}
    </div>
    <div style="text-align:center;">
      <button onclick="showPayment()" style="margin-top:9px;background:#253052;color:#fff;padding:10px 26px;font-weight:700;border-radius:7px;border:none;">Proceed to Checkout</button>
    </div>`;
  document.getElementById('cart-view').innerHTML = out;
}

function updateQty(idx, val) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  val = parseInt(val);
  if (val > 0) {
    cart[idx].qty = val;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
}

function removeItem(idx) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(idx, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function showPayment() {
  document.getElementById('payment-section').style.display = 'block';
  window.scrollTo({top: 10000, behavior: 'smooth'});
}

function submitOrder(e) {
  e.preventDefault();
  let data = {};
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  for (let field of e.target.elements) {
    if (field.name) data[field.name] = field.value;
  }
  data.cart = cart;
  alert('Order placed! (Demo)\nThank you, ' + data.buyer_name + '.');
  localStorage.removeItem('cart');
  window.location.href = 'index.html';
  return false;
}

window.onload = function() {
  updateCartCount();
  if (document.getElementById('cart-view')) {
    renderCart();
  }
};
