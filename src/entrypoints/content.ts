export default defineContentScript({
	matches: [
		'*://www.amazon.ae/*',
		'*://www.amazon.ca/*',
		'*://www.amazon.cn/*',
		'*://www.amazon.co.jp/*',
		'*://www.amazon.co.uk/*',
		'*://www.amazon.co.za/*',
		'*://www.amazon.com/*',
		'*://www.amazon.com.au/*',
		'*://www.amazon.com.be/*',
		'*://www.amazon.com.br/*',
		'*://www.amazon.com.mx/*',
		'*://www.amazon.com.tr/*',
		'*://www.amazon.de/*',
		'*://www.amazon.eg/*',
		'*://www.amazon.es/*',
		'*://www.amazon.fr/*',
		'*://www.amazon.in/*',
		'*://www.amazon.it/*',
		'*://www.amazon.nl/*',
		'*://www.amazon.pl/*',
		'*://www.amazon.sa/*',
		'*://www.amazon.se/*',
		'*://www.amazon.sg/*'
	],
	main() {
		console.log('Amazon Desponsor: content script loaded');
	}
});
