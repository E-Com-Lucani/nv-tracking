/* PostHog for NaturVibes CheckoutChamp funnels (project NV 236046). Served worldwide by jsDelivr as
   https://cdn.jsdelivr.net/gh/E-Com-Lucani/nv-tracking@main/nv-cc.min.js (public repo E-Com-Lucani/nv-tracking);
   every CC domain loads it with one line (README.md). Change it here, then ./deploy.sh: all funnels get the new version within minutes.
   Daniel 2026-11-17: "add it differently, so you can make updates and we don't have to change it everywhere again". */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroups onFeatureFlags addFeatureFlagsHandler onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep get_distinct_id".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
(function () {
  // Loaded twice (old pasted code still in place, or two Global Script entries)? Then the first one counts, not both.
  var KEY0 = 'phc_mUMN87QABZuPxkyR6LUz8pKqLDJe5eeL9evD7DQYuHBL';
  if (window.__nvPhCc) return;
  window.__nvPhCc = true;
  try {
    if (posthog.config && posthog.config.token === KEY0) return;
    for (var q = 0; posthog._i && q < posthog._i.length; q++) if (posthog._i[q][0] === KEY0 && !posthog._i[q][2]) return;
  } catch (e) {}
  var SHOP = 'naturvibes';
  var SENT_KEY = 'ph_cc_sent';            // ids already sent (order ids, upsell txn ids)
  var TOTAL_KEY = 'ph_cc_total_';         // + orderId: order total already reported

  function qs(name) {
    try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; }
  }
  function readJSON(key) {
    try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function num(v) { var n = parseFloat(v); return isFinite(n) ? Math.round(n * 100) / 100 : null; }
  function validEmail(v) { return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? v.trim().toLowerCase() : null; }

  // Sent ids live in localStorage (survives tab close) with sessionStorage as fallback.
  function sentList() {
    var raw = null;
    try { raw = localStorage.getItem(SENT_KEY); } catch (e) {}
    if (!raw) { try { raw = sessionStorage.getItem(SENT_KEY); } catch (e) {} }
    try { return JSON.parse(raw || '[]'); } catch (e) { return []; }
  }
  function wasSent(id) { return sentList().indexOf(String(id)) !== -1; }
  function markSent(id) {
    var l = sentList(); l.push(String(id)); l = JSON.stringify(l.slice(-50));
    try { localStorage.setItem(SENT_KEY, l); } catch (e) {}
    try { sessionStorage.setItem(SENT_KEY, l); } catch (e) {}
  }
  function getTotal(orderId) {
    var v = null;
    try { v = localStorage.getItem(TOTAL_KEY + orderId); } catch (e) {}
    return v === null ? null : num(v);
  }
  function setTotal(orderId, t) { try { localStorage.setItem(TOTAL_KEY + orderId, String(t)); } catch (e) {} }

  function items(list) {
    return (list || []).map(function (it) {
      return {
        product_id: it.productId != null ? String(it.productId) : null,
        variant_id: it.variantDetailId != null ? String(it.variantDetailId) : null,
        name: it.name || null,
        variant: it.title || null,
        price: num(it.price),
        quantity: parseInt(it.qty, 10) || null
      };
    });
  }

  // Visitor id handed over from another domain (advertorial or storefront link: ?ph_did=<anonymous distinct_id>).
  // Only PostHog's anonymous UUID ids are accepted (no emails or other identified ids), and only when
  // this browser has no PostHog id yet, so a crafted link can't merge visits into someone else's profile.
  var bootstrap = {};
  var did = qs('ph_did');
  var hasOwnId = false;
  try { hasOwnId = !!localStorage.getItem('ph_phc_mUMN87QABZuPxkyR6LUz8pKqLDJe5eeL9evD7DQYuHBL_posthog'); } catch (e) {}
  if (!hasOwnId && did && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(did)) bootstrap.distinctID = did;

  posthog.init('phc_mUMN87QABZuPxkyR6LUz8pKqLDJe5eeL9evD7DQYuHBL', {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2026-05-30',
    capture_pageview: false,             // sent below, after the funnel properties are registered
    bootstrap: bootstrap
  });

  function run(pd) {
    var pageType = Number(pd.pageTypeId);
    var stepName = { 2: 'lead', 15: 'lead', 4: 'checkout', 3: 'upsell', 5: 'thank_you' }[pageType] || 'presell';
    var funnel = pd.funnelData || {};
    var page = pd.currentPage || {};
    var od = readJSON('orderData') || {};

    posthog.register({
      shop: SHOP,
      platform: 'checkoutchamp',
      shop_host: location.hostname,
      cc_funnel_id: pd.funnelReferenceId || null,
      cc_funnel_name: funnel.name || null,
      cc_campaign_id: funnel.campaign != null ? String(funnel.campaign) : null,
      cc_page_title: page.title || null,
      cc_page_type: stepName,
      shop_locale: (document.documentElement.lang || '').slice(0, 2) || null
    });
    if (od.country) posthog.register({ shop_country: od.country });

    posthog.capture('$pageview');

    var email = validEmail(od.emailAddress);
    if (email) posthog.identify(email, { email: email });

    if (pageType === 4) {
      posthog.capture('checkout_started', {
        currency: (pd.selectedCampaign && pd.selectedCampaign.currency) || null
      });
    }

    // Add to cart: wrap CC's own handler (Venon wraps it the same way; both run).
    (function wrapATC(tries) {
      if (typeof window.callAddToCartEvent === 'function' && !window.callAddToCartEvent.__ph) {
        var orig = window.callAddToCartEvent;
        window.callAddToCartEvent = function () {
          var r = orig.apply(this, arguments);
          try {
            var p = typeof window.getProductDetails === 'function' ? window.getProductDetails(arguments[0]) : null;
            posthog.capture('add_to_cart', {
              product_id: p && (p.campaignProductId || p.productId) ? String(p.campaignProductId || p.productId) : null,
              product_name: p && p.productName || null
            });
          } catch (e) {}
          return r;
        };
        window.callAddToCartEvent.__ph = true;
      } else if (tries < 40) {
        setTimeout(function () { wrapATC(tries + 1); }, 250);
      }
    })(0);

    // Sales: only on upsell and thank-you pages, i.e. after a paid checkout.
    // checkoutOrderData is written by CC only after a successful checkout payment and holds the
    // checkout-only totals; orderData.totalAmount grows with every accepted upsell (same orderId).
    if (pageType !== 3 && pageType !== 5) return;
    var co = readJSON('checkoutOrderData');
    var orderId = od.orderId != null ? String(od.orderId) : null;
    if (!co || !orderId) return;
    var currency = od.currencyCode || (pd.selectedCampaign && pd.selectedCampaign.currency) || null;

    if (!wasSent(orderId)) {
      var coTotal = num(co.totalAmount);
      posthog.capture('checkout_completed', {
        order_id: orderId,
        value: coTotal,
        revenue: coTotal,
        currency: currency,
        tax: num(co.taxTotal),
        shipping: num(co.shipTotal),
        coupon: od.couponCode || null,
        new_customer: od.newCustomer != null ? !!od.newCustomer : null,
        items: items(co.items),
        $set: email ? { email: email } : undefined
      });
      markSent(orderId);
      setTotal(orderId, coTotal);
    }

    var reported = getTotal(orderId);
    var now = num(od.totalAmount);
    if (reported !== null && now !== null && now - reported > 0.009) {
      var list = od.items || [];
      var last = list[list.length - 1] || {};
      var txn = String(last.merchantTxnId || last.transactionItemId || (orderId + '-' + now));
      if (!wasSent(txn)) {
        var delta = Math.round((now - reported) * 100) / 100;
        var coIds = (co.items || []).map(function (i) { return String(i.productId) + '.' + String(i.variantDetailId || ''); });
        posthog.capture('upsell_purchased', {
          order_id: orderId,
          upsell_txn_id: txn,
          value: delta,
          revenue: delta,
          currency: currency,
          order_total: now,
          items: items(list.filter(function (i) {
            return coIds.indexOf(String(i.productId) + '.' + String(i.variantDetailId || '')) === -1;
          }))
        });
        markSent(txn);
      }
      setTotal(orderId, now);
    }
  }

  (function waitForPageData(tries) {
    var pd = window.pageData;
    if (pd && pd.pageTypeId != null && pd.funnelData) { try { run(pd); } catch (e) {} return; }
    if (tries < 80) setTimeout(function () { waitForPageData(tries + 1); }, 250);
  })(0);
})();
