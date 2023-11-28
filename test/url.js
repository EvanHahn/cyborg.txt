var robots = require('..');
var assert = require("node:assert");

describe('url', function() {

	it('is found for simple domains', function() {
		assert.strictEqual(robots.url('http://example.com'), 'http://example.com/robots.txt');
		assert.strictEqual(robots.url('http://example.com/'), 'http://example.com/robots.txt');
		assert.strictEqual(robots.url('http://www.example.com'), 'http://www.example.com/robots.txt');
		assert.strictEqual(robots.url('http://www.example.com/'), 'http://www.example.com/robots.txt');
		assert.strictEqual(robots.url('https://example.com/'), 'https://example.com/robots.txt');
	});

	it('is found for confusing URLs', function() {
		var url = 'http://user:pASS@hella.dots.host.bike:8080/p/a/t/h?query=string#hash';
		assert.strictEqual(robots.url(url), 'http://user:pASS@hella.dots.host.bike:8080/robots.txt');
	});

	it('throws an error for bad URLs', function() {
		function bad(uri) {
			return function() {
				return robots.url(uri);
			};
		}
		assert.throws(bad('example.com'), Error);
		assert.throws(bad('www.example.com'), Error);
		assert.throws(bad(''), Error);
		assert.throws(bad('http'), Error);
		assert.throws(bad('http://'), Error);
	});

});
