var parse = require('url').parse;

module.exports = function url(uri) {

	var parsed = parse(uri);

	if ((!parsed.protocol) || (!parsed.host)) {
		throw new Error('Cannot parse URL ' + uri);
	}

	return [
		parsed.protocol, '//',
		parsed.auth || '', parsed.auth ? '@' : '',
		parsed.host,
		'/robots.txt'
	].join('');

};
