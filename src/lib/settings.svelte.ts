export type Mode = 'hide' | 'highlight' | 'disabled';

const defaultMode: Mode = 'hide';
const modeItem = storage.defineItem<Mode>('local:mode', { fallback: defaultMode });
let mode = $state<Mode>(defaultMode);
modeItem.getValue().then((v) => (mode = v));
modeItem.watch((v) => (mode = v));

const defaultHighlightColor = '#fde047';
const highlightColorItem = storage.defineItem<string>('local:highlightColor', {
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
