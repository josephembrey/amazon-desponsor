// Toolbar badge driver. The content script sends a count after every
// applyTreatments() run; we set the badge per-tab via sender.tab.id so each
// tab shows its own count. Setting text to '' clears the badge (browsers
// don't render zero counts).
export default defineBackground(() => {
	// Set once at SW start — color is global, not per-tab, so this is enough.
	browser.action.setBadgeBackgroundColor({ color: '#525252' });

	browser.runtime.onMessage.addListener((msg, sender) => {
		if (msg?.type !== 'desponsor:count') return;
		const tabId = sender.tab?.id;
		if (tabId == null) return;
		const count = msg.count as number;
		browser.action.setBadgeText({ tabId, text: count > 0 ? String(count) : '' });
	});
});
