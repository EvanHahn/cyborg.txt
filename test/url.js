var robots = require('..');
require('chai').should();

describe('url', function() {

	it('is found for simple domains', function() {
		robots.url('http://example.com').should.eql('http://example.com/robots.txt');
		robots.url('http://example.com/').should.eql('http://example.com/robots.txt');
		robots.url('http://www.example.com').should.eql('http://www.example.com/robots.txt');
		robots.url('http://www.example.com/').should.eql('http://www.example.com/robots.txt');
		robots.url('https://example.com/').should.eql('https://example.com/robots.txt');
	});

	it('is found for confusing URLs', function() {
		var url = 'http://user:pASS@hella.dots.host.bike:8080/p/a/t/h?query=string#hash';
		robots.url(url).should.eql('http://user:pASS@hella.dots.host.bike:8080/robots.txt');
	});

	it('throws an error for bad URLs', function() {
		function bad(uri) {
			return function() {
				return robots.url(uri);
			};
		}
		bad('example.com').should.Throw(Error);
		bad('www.example.com').should.Throw(Error);
		bad('').should.Throw(Error);
		bad('http').should.Throw(Error);
		bad('http://').should.Throw(Error);
	});

});
