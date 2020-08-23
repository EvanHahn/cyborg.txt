// jshint expr: true

var noop = require("nop");
var after = require("after");
var http = require("http");
var express = require("express");
var robots = require("..");
require("chai").should();

describe("Bot", function () {
  var PORT = 1337;
  var host = "http://localhost:" + PORT + "/";

  var app, server;
  beforeEach(function (done) {
    app = express();
    server = http.createServer(app);
    server.listen(PORT, done);
  });

  afterEach(function (done) {
    server.close(done);
  });

  it("is set up with defaults", function () {
    var bot = new robots.Bot();
    bot.agent.should.equal("Cyborg");
  });

  it("sees a 404 and allows everything", function (done) {
    app.get("/robots.txt", function (req, res) {
      res.sendStatus(404);
    });
    var bot = new robots.Bot();
    var next = after(3, done);
    bot.allows(host, next);
    bot.allows(host + "something.txt", next);
    bot.allows(host + "path/to/something", next);
  });

  it("parses a * directive", function (done) {
    app.get("/robots.txt", function (req, res) {
      res.set("Content-Type", "text/plain");
      res.send(
        [
          "# hello, robot",
          "User-agent: something",
          "Disallow: /something",
          "",
          "User-agent: *",
          "Disallow: /secrets # stay away from my rubies",
        ].join("\n")
      );
    });
    var bot = new robots.Bot();
    var next = after(5, done);
    bot.allows(host, next);
    bot.allows(host + "something", next);
    bot.allows(host + "somethingelse", next);
    bot.allows(host + "secrets", noop, next);
    bot.disallows(host + "secrets", next);
  });

  it("parses a directive with your agent", function (done) {
    app.get("/robots.txt", function (req, res) {
      res.set("Content-Type", "text/plain");
      res.send(
        [
          "User-agent: daftpunk",
          "Disallow: /something",
          "",
          "User-agent: *",
          "Disallow: /secrets",
        ].join("\n")
      );
    });
    var bot = new robots.Bot({ agent: "daftpunk" });
    var next = after(3, done);
    bot.allows(host, next);
    bot.allows(host + "secrets", next);
    bot.disallows(host + "something", next);
  });

  it("parses a directive without your agent", function (done) {
    app.get("/robots.txt", function (req, res) {
      res.set("Content-Type", "text/plain");
      res.send(["User-agent: other", "Disallow: /something"].join("\n"));
    });
    var bot = new robots.Bot({ agent: "daftpunk" });
    var next = after(3, done);
    bot.allows(host, next);
    bot.allows(host + "secrets", next);
    bot.allows(host + "something", next);
  });
});
