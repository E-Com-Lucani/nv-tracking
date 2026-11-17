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
  // Own instance "nvph": the page may run its own PostHog (partner sites), which must stay untouched.
  var ph = posthog.init(KEY, {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2026-05-30',
    bootstrap: bootstrap
  }, 'nvph') || posthog.nvph;
  function P() { return (window.posthog && window.posthog.nvph) || ph; }  // the library swaps the stub for the real instance
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
window.__nvBuild=window.__nvBuild||{};window.__nvBuild['nv-page']='33599170c17a';
