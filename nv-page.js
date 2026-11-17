/* PostHog for NaturVibes pages outside the Shopify theme and CheckoutChamp (GemPages-hosted volks-blatt.de, partner
   advertorial sites), project NV 236046. Served worldwide by jsDelivr as
   https://cdn.jsdelivr.net/gh/E-Com-Lucani/nv-tracking@main/nv-page.min.js. Same code as the theme snippet snippets/posthog.liquid (nv-shopify-theme), theme_layout =
   gempages-hosted, no cart tagging. Change it here, then ./deploy.sh. */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroups onFeatureFlags addFeatureFlagsHandler onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
(function () {
  var KEY = 'phc_mUMN87QABZuPxkyR6LUz8pKqLDJe5eeL9evD7DQYuHBL';
  var OUR = ['naturvibes.de', 'volks-blatt.de', 'try-naturvibes.com', 'outdoor-bilanz.de'];
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  function site(host) {
    host = (host || '').toLowerCase();
    for (var i = 0; i < OUR.length; i++) {
      if (host === OUR[i] || host.slice(-(OUR[i].length + 1)) === '.' + OUR[i]) return OUR[i];
    }
    return null;
  }
  var bootstrap = {};
  try {
    var did = new URLSearchParams(location.search).get('ph_did');
    var own = localStorage.getItem('ph_' + KEY + '_posthog') || document.cookie.indexOf('ph_' + KEY + '_posthog=') !== -1;
    if (did && !own && UUID.test(did)) bootstrap.distinctID = did;
  } catch (e) {}
  if (window.__nvPhPage) return;
  window.__nvPhPage = true;
  // Page runs someone else's PostHog (partner site): don't share their library (a blocked or newer snippet would stop
  // ours too). Send our page view straight to our proxy and hand our own visitor id on in links to our domains.
  var foreign = false;
  try {
    var q = (window.posthog && window.posthog._i) || [];
    for (var n = 0; n < q.length; n++) if (q[n][0] && q[n][0] !== KEY) foreign = true;
    if (window.posthog && window.posthog.config && window.posthog.config.token && window.posthog.config.token !== KEY) foreign = true;
  } catch (e) {}
  if (foreign) {
    var vid = null;
    try { vid = localStorage.getItem('nv_vid'); } catch (e) {}
    if (!vid || !UUID.test(vid)) {
      vid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
      try { localStorage.setItem('nv_vid', vid); } catch (e) {}
    }
    try {
      var body = JSON.stringify({ api_key: KEY, event: '$pageview', distinct_id: vid, timestamp: new Date().toISOString(),
        properties: { $current_url: location.href, $host: location.hostname, $pathname: location.pathname,
          $referrer: document.referrer || '$direct', theme_layout: 'partner', shop_host: location.hostname, $lib: 'nv-page-light' } });
      fetch('https://e.naturvibes.de/i/v0/e/', { method: 'POST', body: body, keepalive: true, mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
    } catch (e) {}
    var here0 = site(location.hostname);
    var tag0 = function (ev) {
      try {
        var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
        if (!a) return;
        var url = new URL(a.href, location.href), to = site(url.hostname);
        if (!to || to === here0 || url.searchParams.has('ph_did')) return;
        url.searchParams.set('ph_did', vid);
        a.href = url.toString();
      } catch (e) {}
    };
    document.addEventListener('mousedown', tag0, true);
    document.addEventListener('touchstart', tag0, { capture: true, passive: true });
    document.addEventListener('click', tag0, true);
    return;
  }
  // Own instance "nvph": the page may run its own PostHog (partner sites), which must stay untouched.
  var ph = posthog.init(KEY, {
    api_host: 'https://e.naturvibes.de',  // PostHog managed reverse proxy on our domain, not on ad-blocker lists (Daniel 2026-11-17)
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-05-30',
    bootstrap: bootstrap
  }, 'nvph') || posthog.nvph;
  function P() { return (window.posthog && window.posthog.nvph) || ph; }  // the library swaps the stub for the real instance
  // If the page's own PostHog is blocked (ad blocker on posthog.com), its snippet may never load the library, and ours
  // with it: then load the library ourselves from our proxy. It starts every queued instance, ours included.
  setTimeout(function () {
    try {
      if (P().__loaded || (window.posthog && window.posthog.__loaded)) return;
      var sc = document.createElement('script');
      sc.async = true; sc.crossOrigin = 'anonymous'; sc.src = 'https://e.naturvibes.de/static/array.js';
      document.head.appendChild(sc);
    } catch (e) {}
  }, 3000);
  P().register({ theme_layout: 'gempages-hosted', shop_host: location.hostname });

  // Links to our other domains carry the visitor id (on click, so links added later count too).
  var here = site(location.hostname);
  function tag(ev) {
    try {
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
      if (!a || !P().__loaded || typeof P().get_distinct_id !== 'function') return;
      var url = new URL(a.href, location.href);
      var to = site(url.hostname);
      if (!to || to === here || url.searchParams.has('ph_did')) return;
      url.searchParams.set('ph_did', P().get_distinct_id());
      a.href = url.toString();
    } catch (e) {}
  }
  // Shopify orders carry the visitor id as cart attribute _ph_did, so an order can be matched to the visitor and
  // their first page (Funnel Performance dashboard). Set after any add to cart and on page load when the cart has items.
  if ('gempages-hosted' !== 'gempages-hosted' && window.fetch) {
    var tagging = false;
    function tagCart(force) {
      if (tagging || !P().__loaded || typeof P().get_distinct_id !== 'function') return;
      var id = P().get_distinct_id(), done = null;
      try { done = sessionStorage.getItem('ph_cart_tagged'); } catch (e) {}
      if (!force && done === id) return;  // already on this session's cart: no request on every page view
      tagging = true;
      fetch('/cart.js', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (c) {
        if (!force && !c.item_count) return;
        if ((c.attributes || {})._ph_did === id) { try { sessionStorage.setItem('ph_cart_tagged', id); } catch (e) {} return; }
        return fetch('/cart/update.js', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attributes: { _ph_did: id } }) }).then(function (r) {
          if (r.ok) { try { sessionStorage.setItem('ph_cart_tagged', id); } catch (e) {} }
        });
      }).catch(function () {}).then(function () { tagging = false; });
    }
    var origFetch = window.fetch;
    window.fetch = function (input) {
      var p = origFetch.apply(this, arguments);
      try {
        var u = typeof input === 'string' ? input : (input && input.url) || '';
        if (/\/cart\/add/.test(u)) p.then(function () { setTimeout(function () { tagCart(true); }, 300); }, function () {});
      } catch (e) {}
      return p;
    };
    setTimeout(function () { tagCart(false); }, 2500);
  }

  document.addEventListener('mousedown', tag, true);
  document.addEventListener('touchstart', tag, { capture: true, passive: true });
  document.addEventListener('click', tag, true);
})();
window.__nvBuild=window.__nvBuild||{};window.__nvBuild['nv-page']='da9a06db035f';
