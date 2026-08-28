/* ============================================================
   KNIGHTS ATELIER — products.js  (PDP: size select + add to cart)
   ============================================================ */
(function () {
  'use strict';
  var doc = document;
  var HANDLE = 'the-first';

  function init() {
    var Shop = window.KAShop;
    var row = doc.querySelector('[data-sizes]');
    var form = doc.querySelector('[data-buy]');
    var msg = form && form.querySelector('.buy__msg');
    if (!Shop || !row || !form) return;
    var product = Shop.product(HANDLE);
    if (!product) return;

    product.variants.forEach(function (v) {
      var label = doc.createElement('label');
      label.className = 'size';
      label.innerHTML = '<input type="radio" name="size" value="' + v.id + '"><span>' + v.title + '</span>';
      row.appendChild(label);
    });

    var priceEl = doc.querySelector('[data-price]');
    if (priceEl) priceEl.textContent = '$' + product.price;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var checked = form.querySelector('input[name=size]:checked');
      if (!checked) {
        if (msg) { msg.textContent = 'Choose a size first.'; msg.setAttribute('data-error', ''); }
        return;
      }
      if (msg) msg.removeAttribute('data-error');
      Shop.add(HANDLE, checked.value);
      var v = product.variants.filter(function (x) { return x.id === checked.value; })[0];
      if (msg) msg.textContent = 'Added — ' + (v ? v.title : checked.value) + '. In your cart.';
    });
  }

  if (doc.readyState !== 'loading') init();
  else doc.addEventListener('DOMContentLoaded', init);
})();
