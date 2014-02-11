var parse = require('url').parse;

module.exports = function url(uri) {

	var parsed = parse(uri);

	return [
		parsed.protocol || 'http:', '//',
		parsed.auth || '', parsed.auth ? '@' : '',
		parsed.host,
		'/robots.txt'
	].join('');

};
