# nv-tracking

Analytics loader scripts for NaturVibes pages outside the Shopify theme (CheckoutChamp funnels, GemPages-hosted pages,
partner advertorials). Public on purpose: pages load them through jsDelivr's global CDN.

- `nv-cc.js`: CheckoutChamp funnels — `<script src="https://cdn.jsdelivr.net/gh/E-Com-Lucani/nv-tracking@main/nv-cc.min.js"></script>`
- `nv-page.js`: other pages — `<script src="https://cdn.jsdelivr.net/gh/E-Com-Lucani/nv-tracking@main/nv-page.min.js"></script>`

Source and docs: `~/cc-pages/naturvibes/posthog-cc-tracking/` on the EcomGalaxy server (deploy.sh pushes here and
clears the jsDelivr cache). Don't edit here directly.
