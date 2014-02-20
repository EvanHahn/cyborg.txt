var noop = require('nop');
var url = require('url');
var findURL = require('../url');
var DEFAULT_BODY = require('../default');
var request = require('superagent');

function Bot(options) {
	options = options || {};
	this.agent = options.agent || 'Cyborg';
	this.maxAge = options.maxAge || 1000;
	this.robots = {};
}

Bot.prototype.load = function(uri, callback) {

	var robotsURL = findURL(uri);
	var cached = this.robots[robotsURL];
	var now = new Date();

	if (cached && cached.expires && (cached.expires > now)) {

		callback(cached.body);

	} else {

		var me = this;
		request
			.get(robotsURL)
			.set('User-Agent', this.agent)
			.end(function(err, res) {

				var data = {};

				data.expires = new Date(Date.now() + this.maxAge);

				if (!err && res.ok) {
					data.body = res.text;
					if (res.header.expires)
						data.expires = new Date(res.header.expires);
				} else {
					data.body = DEFAULT_BODY;
				}

				me.robots[robotsURL] = data;
				callback(data.body);

			});

	}

};

Bot.prototype.parse = function(contents, robotsURL) {

	if (!this.robots[robotsURL])
		this.robots[robotsURL] = {};

	var withoutComments = contents.replace(/#.*$/gm, '');
	var lines = withoutComments.match(/^.*$/gm);

	var agents = {};
	var currentAgent;
	lines.forEach(function(line) {

		line = line.trim().toLowerCase();

		var isNewUserAgent = line.indexOf('user-agent:') === 0;
		var isDisallow = line.indexOf('disallow:') === 0;

		if (isNewUserAgent) {
			currentAgent = line.substr(11).trim();
			agents[currentAgent] = [];
		} else if (isDisallow) {
			var path = line.substr(9).trim();
			if (path)
				agents[currentAgent].push(path);
		}

	});

	this.robots[robotsURL].agents = agents;

	return agents;

};

Bot.prototype.allows = function(uri, success, failure) {

	var pathname = url.parse(uri).pathname;
	var robotsURL = findURL(uri);
	failure = failure || noop;

	var me = this;
	this.load(uri, function(file) {

		var agents = me.robots[robotsURL].agents;
		if (!agents)
			agents = me.parse(file, robotsURL);

		var agent = agents[me.agent] || agents['*'];
		if (!agent) {
			success();
			return;
		}

		for (var i = 0; i < agent.length; i ++) {

			var directive = agent[i];

			var lastCharacter = directive[directive.length - 1];
			var isDirectory = lastCharacter === '/';

			var allowed;
			if (isDirectory) {
				allowed = pathname.indexOf(directive) !== 0;
			} else {
				allowed = pathname != directive;
			}

			if (!allowed) {
				if (failure)
					failure();
				return;
			}

		}

		success();

	});

};

Bot.prototype.disallows = function(uri, success, failure) {
	this.allows(uri, failure || noop, success);
};

module.exports = Bot;
