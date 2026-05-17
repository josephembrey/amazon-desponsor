import {
	defaultHighlightColor,
	defaultMode,
	highlightColorItem,
	modeItem,
	type Mode
} from '@/lib/settings.svelte';

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

const SPONSORED_SELECTORS = [
	'.puis-label-popover-default',
	'[aria-label="View Sponsored information"]',
	'.s-sponsored-header'
].join(', ');
const TILE_SELECTOR = '.s-result-item';
const CARD_SELECTORS = ['.puis-card-container', '.s-card-container', '.a-cardui'].join(', ');
const OPAQUE_INNER_SELECTORS = [
	'.desktop-grid-content-view',
	'.s-grid-status-badge-container',
	'.s-color-swatch-container',
	'.s-product-image-container',
	'.s-product-image-container::after'
];
const MARKER_ATTR = 'data-desponsor';

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

		function getTintTarget(tile: HTMLElement): HTMLElement {
			return tile.querySelector<HTMLElement>(CARD_SELECTORS) ?? tile;
		}

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

		function clearTreatments() {
			document.querySelectorAll<HTMLElement>(`[${MARKER_ATTR}]`).forEach((tile) => {
				getHideTarget(tile).style.display = '';
				getTintTarget(tile).style.backgroundColor = '';
				tile.removeAttribute(MARKER_ATTR);
			});
		}

		function applyTreatments() {
			clearTreatments();
			if (mode === 'disabled') return;

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
					getTintTarget(tile).style.backgroundColor = `${highlightColor}33`;
				}
			}
		}

		Promise.all([modeItem.getValue(), highlightColorItem.getValue()]).then(([m, c]) => {
			mode = m;
			highlightColor = c;
			applyTreatments();
		});

		modeItem.watch((v) => {
			mode = v;
			applyTreatments();
		});
		highlightColorItem.watch((v) => {
			highlightColor = v;
			applyTreatments();
		});

		let debounceTimer: number | undefined;
		const observer = new MutationObserver(() => {
			if (debounceTimer != null) clearTimeout(debounceTimer);
			debounceTimer = window.setTimeout(applyTreatments, 500);
		});
		observer.observe(document.body, { childList: true, subtree: true });

		ctx.onInvalidated(() => {
			observer.disconnect();
			styleEl.remove();
			if (debounceTimer != null) clearTimeout(debounceTimer);
		});
	}
});
