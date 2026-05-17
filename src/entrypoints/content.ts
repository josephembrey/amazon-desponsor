import {
	defaultHighlightColor,
	defaultMode,
	highlightColorItem,
	modeItem,
	type Mode
} from '@/lib/settings.svelte';

// Country domains the script runs on. WXT generates the manifest `matches`
// list from this at build time; add a TLD here to support a new locale.
const AMAZON_TLDS = [
	'ae',
	'ca',
	'cn',
	'co.jp',
	'co.uk',
	'co.za',
	'com',
	'com.au',
	'com.be',
	'com.br',
	'com.mx',
	'com.tr',
	'de',
	'eg',
	'es',
	'fr',
	'in',
	'it',
	'nl',
	'pl',
	'sa',
	'se',
	'sg'
];

// Indicators that a tile is sponsored. Anything matching here is traced up to
// its enclosing .s-result-item via closest().
const SPONSORED_SELECTORS = [
	'.puis-label-popover-default', // standard product tile "Sponsored" info-popover badge
	'[aria-label="View Sponsored information"]', // alternate aria-labelled version of the same badge
	'.s-sponsored-header', // legacy section header for sponsored result groups
	'.puis-sponsored-label-text', // sponsored brand video (SBV) single-product banner
	'[data-ad-feedback-payload]', // sponsored brand themed-collection (SBTC) multi-product banner
	'.AdHolder' // iframed sidebar/skyscraper ad placements (class is on .s-result-item itself)
].join(', ');

// Top-level tile each sponsored indicator belongs to; the unit we hide/highlight.
const TILE_SELECTOR = '.s-result-item';

// Inner card wrappers used as the tint target — tinting these instead of the
// tile avoids bleeding into neighboring tiles' margins.
const CARD_SELECTORS = [
	'.puis-card-container', // current grid layout
	'.s-card-container', // current list layout
	'.a-cardui' // older card style still present on some pages
].join(', ');

// Inner elements that paint their own opaque background and would otherwise
// cover our tint. These get forced transparent via injected CSS scoped to
// marked tiles only.
const OPAQUE_INNER_SELECTORS = [
	'.desktop-grid-content-view', // grey card body wrapper
	'.s-grid-status-badge-container', // badge strip across the top of a card
	'.s-color-swatch-container', // white box around color/pattern swatches
	'.s-product-image-container', // image container (sometimes has a grey bg)
	'.s-product-image-container::after' // dark gutter pseudo-element behind product images
];
// Attribute we stamp on every treated tile. Serves two purposes:
//   1. clearTreatments() uses it to find tiles to revert
//   2. OVERRIDE_CSS uses it to scope its transparency rules to our tiles only
const MARKER_ATTR = 'data-desponsor';

// Stylesheet injected into <head> on script start. We need a stylesheet (not
// inline styles) because some opaque elements are ::after pseudo-elements,
// which can't be touched via element.style. Rules are scoped to [data-desponsor]
// so untreated tiles render normally.
const OVERRIDE_CSS = `
	${OPAQUE_INNER_SELECTORS.map((s) => `[${MARKER_ATTR}] ${s}`).join(',\n\t')} {
		background-color: transparent !important;
		background-image: none !important;
	}
`;

export default defineContentScript({
	matches: AMAZON_TLDS.map((tld) => `*://www.amazon.${tld}/*`),
	main(ctx) {
		let mode: Mode = defaultMode;
		let highlightColor = defaultHighlightColor;

		const styleEl = document.createElement('style');
		styleEl.textContent = OVERRIDE_CSS;
		document.head.appendChild(styleEl);

		// Tinting the .s-result-item itself bleeds into neighboring tiles because
		// grid margins overlap. We tint an inner card instead. Falls back to the
		// tile when no card wrapper exists (e.g. the SBTC banner uses a hashed
		// class container we can't reliably target — tinting the outer tile is
		// acceptable there since the banner spans the full row).
		function getTintTarget(tile: HTMLElement): HTMLElement {
			return tile.querySelector<HTMLElement>(CARD_SELECTORS) ?? tile;
		}

		// Walks up from the tile to the outermost wrapper that still only
		// contains this single tile. Amazon nests tiles inside grid/spacing
		// divs; hiding just the .s-result-item leaves an empty spacer behind.
		// We stop walking once a parent contains more than one tile (i.e. a row
		// or grid we don't own).
		function getHideTarget(tile: HTMLElement): HTMLElement {
			let target: HTMLElement = tile;
			while (
				target.parentElement &&
				target.parentElement.querySelectorAll(TILE_SELECTOR).length === 1
			) {
				target = target.parentElement;
			}
			return target;
		}

		// Reverts every tile we've previously marked. Called at the start of
		// every applyTreatments() so state doesn't accumulate across re-runs
		// (e.g. when the user switches modes or new tiles appear).
		function clearTreatments() {
			document.querySelectorAll<HTMLElement>(`[${MARKER_ATTR}]`).forEach((tile) => {
				getHideTarget(tile).style.display = '';
				getTintTarget(tile).style.backgroundColor = '';
				tile.removeAttribute(MARKER_ATTR);
			});
		}

		// Sends the current sponsored count to background.ts, which sets the
		// toolbar badge per-tab. The .catch swallows "no receiving end" errors
		// that can occur if the background SW is mid-restart during teardown.
		function reportCount(n: number) {
			browser.runtime.sendMessage({ type: 'desponsor:count', count: n }).catch(() => {});
		}

		// Full re-treat: wipe previous state, find current sponsored tiles, and
		// apply mode + color. We deduplicate via a Set because a single tile
		// can match multiple SPONSORED_SELECTORS at once. Cheap enough to run
		// on every DOM change at typical search-page sizes.
		function applyTreatments() {
			clearTreatments();
			if (mode === 'disabled') {
				reportCount(0);
				return;
			}

			const tiles = new Set<HTMLElement>();
			document.querySelectorAll(SPONSORED_SELECTORS).forEach((el) => {
				const tile = el.closest<HTMLElement>(TILE_SELECTOR);
				if (tile) tiles.add(tile);
			});

			for (const tile of tiles) {
				tile.setAttribute(MARKER_ATTR, '');
				if (mode === 'hide') {
					getHideTarget(tile).style.display = 'none';
				} else {
					// Highlight color + "33" alpha hex = ~20% opacity tint.
					getTintTarget(tile).style.backgroundColor = `${highlightColor}33`;
				}
			}

			reportCount(tiles.size);
		}

		// Initial read of persisted settings. watch() below only fires on
		// subsequent changes, so we need this one-shot read to bootstrap.
		Promise.all([modeItem.getValue(), highlightColorItem.getValue()]).then(([m, c]) => {
			mode = m;
			highlightColor = c;
			applyTreatments();
		});

		// Cross-context updates: popup changes settings → storage.watch fires
		// here → we re-treat. This is how popup actions reach the page live.
		modeItem.watch((v) => {
			mode = v;
			applyTreatments();
		});
		highlightColorItem.watch((v) => {
			highlightColor = v;
			applyTreatments();
		});

		// Amazon lazy-loads / re-renders results as you scroll, filter, or
		// paginate. Re-treat on DOM changes, debounced 500ms so we don't run
		// on every individual mutation during heavy render bursts.
		let debounceTimer: number | undefined;
		const observer = new MutationObserver(() => {
			if (debounceTimer != null) clearTimeout(debounceTimer);
			debounceTimer = window.setTimeout(applyTreatments, 500);
		});
		observer.observe(document.body, { childList: true, subtree: true });

		// Teardown fires on page navigation, extension reload, or HMR. Remove
		// our DOM additions and clear the badge so it doesn't show a stale
		// count on tabs that navigated off Amazon.
		ctx.onInvalidated(() => {
			observer.disconnect();
			styleEl.remove();
			if (debounceTimer != null) clearTimeout(debounceTimer);
			reportCount(0);
		});
	}
});
