module.exports = function build(options) {

	var bots = Object.keys(options);
	bots.sort(function(a) {
		return a === '*';
	});

	return bots.map(function(bot) {
		var firstLine = 'User-agent: ' + bot + '\n';
		var disallowList = options[bot].map(function(disallow) {
			var result = 'Disallow: ';
			if (disallow[0] !== '/') {
				result += '/';
			}
			result += disallow;
			return result;
		}).join('\n');
		return firstLine + disallowList;
	}).join('\n\n');

};
