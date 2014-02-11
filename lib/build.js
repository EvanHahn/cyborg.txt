module.exports = function build(options) {

	options = options || {};

	var bots = Object.keys(options);
	bots.sort(function(a) {
		return a === '*';
	});

	if (!bots.length) {
		return build({ '*': [] });
	}

	return bots.map(function(bot) {

		var firstLine = 'User-agent: ' + bot + '\n';
		var disallowList;

		if (options[bot].length) {
			disallowList = options[bot].map(function(disallow) {
				var result = 'Disallow: ';
				if (disallow[0] !== '/') {
					result += '/';
				}
				result += disallow;
				return result;
			}).join('\n');
		} else {
			disallowList = 'Disallow:';
		}

		return firstLine + disallowList;

	}).join('\n\n');

};
