var robots = require("..");
var connect = require("connect");
var request = require("supertest");
var { parse } = require("./helpers");
var assert = require("node:assert");

describe("Connect-compatible middleware", function () {
  it("serves robots.txt", async function () {
    var app = connect();
    app.use(
      robots.middleware({
        nsa: ["/"],
        "*": ["robocop_copyright_info"],
        coolbot: ["/secret_codes.txt", "cool_burrito_photo.jpg"],
        everythingbot: [],
      })
    );

    const { text } = await request(app)
      .get("/robots.txt")
      .expect("Content-Type", /text\/plain/)
      .expect(200);

    assert.ok(text.includes(["User-agent: nsa", "Disallow: /"].join("\n")));
    assert.ok(
      text.includes(
        [
          "User-agent: coolbot",
          "Disallow: /secret_codes.txt",
          "Disallow: /cool_burrito_photo.jpg",
        ].join("\n")
      )
    );
    assert.ok(
      text.includes(
        ["User-agent: everythingbot", "Disallow:"].join("\n")
      )
    );
    assert.ok(
      text.includes(
        ["User-agent: *", "Disallow: /robocop_copyright_info"].join("\n")
      )
    );

    assert.deepStrictEqual(parse(text), {
      nsa: ["/"],
      "*": ["/robocop_copyright_info"],
      coolbot: ["/secret_codes.txt", "/cool_burrito_photo.jpg"],
      everythingbot: [],
    });
  });
});
