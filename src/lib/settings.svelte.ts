// Reactive wrapper around WXT storage. The popup binds to `settings.*` for
// instant UI reactivity; writes flow through to storage and propagate to the
// content script via `*.watch()`. Defaults are exported so the content
// script can use them as initial values without duplicating literals.
//
// Per-setting structure:
//   - `default*`     – initial / fallback value (also storage fallback)
//   - `*Item`        – WXT storage handle (used by content script + here)
//   - local $state   – reactive cell that backs the getter/setter
//   - getValue().then – one-shot bootstrap (watch only fires on changes)
//   - watch          – keeps the cell in sync with cross-context writes

export type Mode = 'hide' | 'highlight' | 'disabled';

export const defaultMode: Mode = 'highlight';
export const modeItem = storage.defineItem<Mode>('local:mode', { fallback: defaultMode });
let mode = $state<Mode>(defaultMode);
modeItem.getValue().then((v) => (mode = v));
modeItem.watch((v) => (mode = v));

export const defaultHighlightColor = '#fbbf24';
export const highlightColorItem = storage.defineItem<string>('local:highlightColor', {
	fallback: defaultHighlightColor
});
let highlightColor = $state(defaultHighlightColor);
highlightColorItem.getValue().then((v) => (highlightColor = v));
highlightColorItem.watch((v) => (highlightColor = v));

// Setters write to storage as a side effect — that's what makes a popup
// change propagate to the content script via the watch() above.
export const settings = {
	get mode() {
		return mode;
	},
	set mode(v: Mode) {
		mode = v;
		modeItem.setValue(v);
	},

	get highlightColor() {
		return highlightColor;
	},
	set highlightColor(v: string) {
		highlightColor = v;
		highlightColorItem.setValue(v);
	}
};
