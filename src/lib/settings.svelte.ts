export type Mode = 'hide' | 'highlight' | 'disabled';

export const defaultMode: Mode = 'hide';
export const modeItem = storage.defineItem<Mode>('local:mode', { fallback: defaultMode });
let mode = $state<Mode>(defaultMode);
modeItem.getValue().then((v) => (mode = v));
modeItem.watch((v) => (mode = v));

export const defaultHighlightColor = '#fde047';
export const highlightColorItem = storage.defineItem<string>('local:highlightColor', {
	fallback: defaultHighlightColor
});
let highlightColor = $state(defaultHighlightColor);
highlightColorItem.getValue().then((v) => (highlightColor = v));
highlightColorItem.watch((v) => (highlightColor = v));

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
