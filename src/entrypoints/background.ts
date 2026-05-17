export default defineBackground(() => {
	browser.action.setBadgeBackgroundColor({ color: '#525252' });

	browser.runtime.onMessage.addListener((msg, sender) => {
		if (msg?.type !== 'desponsor:count') return;
		const tabId = sender.tab?.id;
		if (tabId == null) return;
		const count = msg.count as number;
		browser.action.setBadgeText({ tabId, text: count > 0 ? String(count) : '' });
	});
});
