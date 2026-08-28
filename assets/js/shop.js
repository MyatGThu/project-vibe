/* ============================================================
   KNIGHTS ATELIER — shop.js
   The ONE commerce swap-point. The static front-end stays on Pages; Shopify
   runs the checkout. A real localStorage-backed cart today (no fake buttons);
   to go live, fill CONFIG with a PUBLIC Storefront token and flip USE_SHOPIFY.
   Nothing else on the site changes.
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = {
    domain: 'your-store.myshopify.com',   // SWAP: your Shopify domain
    storefrontToken: '',                  // SWAP: PUBLIC Storefront access token (read-only, safe to embed). NEVER an Admin token.
    apiVersion: '2025-01'
  };
  var USE_SHOPIFY = false;                 // SWAP: true once CONFIG is filled

  // Mock catalog until Storefront is connected (shape mirrors the Storefront query result).
  var CATALOG = {
    'the-first': {
      handle: 'the-first', title: 'The First — Leather Jacket', price: 450, currency: 'USD',
      variants: [
        { id: 'xs', title: 'XS' }, { id: 's', title: 'S' }, { id: 'm', title: 'M' },
        { id: 'l', title: 'L' }, { id: 'xl', title: 'XL' }
      ]
    }
  };

  var KEY = 'ka_cart';
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{"lines":[],"count":0}'); } catch (e) { return { lines: [], count: 0 }; } }
  function write(cart) {
    cart.count = cart.lines.reduce(function (n, l) { return n + l.qty; }, 0);
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
    window.dispatchEvent(new CustomEvent('ka:cart'));   // site.js updates the nav count
    return cart;
  }

  window.KAShop = {
    catalog: CATALOG,
    product: function (handle) { return CATALOG[handle]; },
    getCart: read,
    add: function (handle, variantId, qty) {
      qty = qty || 1;
      var p = CATALOG[handle]; if (!p) return read();
      var v = p.variants.filter(function (x) { return x.id === variantId; })[0] || p.variants[0];
      var cart = read();
      var line = cart.lines.filter(function (l) { return l.handle === handle && l.variantId === v.id; })[0];
      if (line) line.qty += qty;
      else cart.lines.push({ handle: handle, variantId: v.id, title: p.title, variant: v.title, price: p.price, qty: qty });
      return write(cart);
    },
    remove: function (handle, variantId) {
      var cart = read();
      cart.lines = cart.lines.filter(function (l) { return !(l.handle === handle && l.variantId === variantId); });
      return write(cart);
    },
    clear: function () { return write({ lines: [], count: 0 }); },
    checkout: function () {
      if (!USE_SHOPIFY || !CONFIG.storefrontToken) {
        return { connected: false, message: 'Checkout goes live once Shopify is connected (Storefront token in assets/js/shop.js).' };
      }
      // SWAP POINT — real flow when USE_SHOPIFY is true:
      //   POST a GraphQL `cartCreate` (merchandiseId = Storefront variant GIDs) to
      //   https://{domain}/api/{apiVersion}/graphql.json with header
      //   'X-Shopify-Storefront-Access-Token': CONFIG.storefrontToken, then
      //   window.location = data.cartCreate.cart.checkoutUrl  (Shopify hosted checkout).
      return { connected: true };
    }
  };
})();
