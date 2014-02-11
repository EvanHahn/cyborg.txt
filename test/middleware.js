var robots = require('..');
var connect = require('connect');
var request = require('supertest');
require('chai').should();

describe('Connect-compatible middleware', function() {

	it('serves robots.txt', function(done) {

		var expectedBody = [
			'User-agent: nsa',
			'Disallow: /',
			'',
			'User-agent: coolbot',
			'Disallow: /secret_codes.txt',
			'Disallow: /cool_burrito_photo.jpg',
			'',
			'User-agent: everythingbot',
			'Disallow:',
			'',
			'User-agent: *',
			'Disallow: /robocop_copyright_info'
		].join('\n');

		var app = connect();

		app.use(robots.middleware({
			'nsa': ['/'],
			'*': ['robocop_copyright_info'],
			'coolbot': [
				'/secret_codes.txt',
				'cool_burrito_photo.jpg'
			],
			'everythingbot': []
		}));

		request(app).get('/robots.txt')
			.expect('Content-Type', /text\/plain/)
			.expect(expectedBody)
			.expect(200, done);

	});

});
