var robots = require("..");
var { parse } = require("./helpers");
var assert = require("node:assert");

describe("build", function () {
  it("builds a robots.txt", function () {
    var actual = robots.build({
      nsa: ["/"],
      "*": ["robocop_copyright_info"],
      coolbot: ["/secret_codes.txt", "cool_burrito_photo.jpg"],
      everythingbot: [],
    });

    assert.ok(actual.includes(["User-agent: nsa", "Disallow: /"].join("\n")));
    assert.ok(
      actual.includes(
        [
          "User-agent: coolbot",
          "Disallow: /secret_codes.txt",
          "Disallow: /cool_burrito_photo.jpg",
        ].join("\n")
      )
    );
    assert.ok(
      actual.includes(
        ["User-agent: everythingbot", "Disallow:"].join("\n")
      )
    );
    assert.ok(
      actual.includes(
        ["User-agent: *", "Disallow: /robocop_copyright_info"].join("\n")
      )
    );

    assert.deepStrictEqual(parse(actual), {
      nsa: ["/"],
      "*": ["/robocop_copyright_info"],
      coolbot: ["/secret_codes.txt", "/cool_burrito_photo.jpg"],
      everythingbot: [],
    });
  });

  it("builds an empty robots.txt", function () {
    var expected = ["User-agent: *", "Disallow:"].join("\n");
    assert.strictEqual(robots.build(), expected);
    assert.strictEqual(robots.build({}), expected);
  });
});
