/* ============================================================
   KNIGHTS ATELIER — contact.js  (accessible validation; mock submit)
   ============================================================ */
(function () {
  'use strict';
  var doc = document;

  function init() {
    var form = doc.querySelector('[data-contact]');
    if (!form) return;

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true, first = null;
      var name = doc.getElementById('c-name');
      var email = doc.getElementById('c-email');
      var msg = doc.getElementById('c-message');

      function check(input, invalid, message) {
        var e = doc.getElementById(input.id + '-err');
        if (invalid) { input.setAttribute('aria-invalid', 'true'); if (e) e.textContent = message; ok = false; if (!first) first = input; }
        else { input.removeAttribute('aria-invalid'); if (e) e.textContent = ''; }
      }
      check(name, !name.value.trim(), 'Tell us your name.');
      check(email, !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value), 'Enter a valid email address.');
      check(msg, !msg.value.trim(), 'Add a short message.');

      if (!ok) { if (first) first.focus(); return; }

      // Mock submit — real backend (Shopify contact / Formspree / email API) swaps in here.
      var safeName = name.value.trim().replace(/[<>&]/g, '');
      form.innerHTML = '<p class="cform__done" tabindex="-1" role="status">Thank you, ' + safeName +
        '. Your note is with us — we’ll reply within two working days.</p>';
      var done = form.querySelector('.cform__done');
      if (done) done.focus();
    });

    // clear a field's error as soon as the user corrects it
    ['c-name', 'c-email', 'c-message'].forEach(function (id) {
      var el = doc.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') {
          el.removeAttribute('aria-invalid');
          var e = doc.getElementById(id + '-err');
          if (e) e.textContent = '';
        }
      });
    });
  }

  if (doc.readyState !== 'loading') init();
  else doc.addEventListener('DOMContentLoaded', init);
})();
