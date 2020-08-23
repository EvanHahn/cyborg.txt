var robots = require("..");
var { parse } = require("./helpers");
require("chai").should();

describe("build", function () {
  it("builds a robots.txt", function () {
    var actual = robots.build({
      nsa: ["/"],
      "*": ["robocop_copyright_info"],
      coolbot: ["/secret_codes.txt", "cool_burrito_photo.jpg"],
      everythingbot: [],
    });

    actual.should.have.string(["User-agent: nsa", "Disallow: /"].join("\n"));
    actual.should.have.string(
      [
        "User-agent: coolbot",
        "Disallow: /secret_codes.txt",
        "Disallow: /cool_burrito_photo.jpg",
      ].join("\n")
    );
    actual.should.have.string(
      ["User-agent: everythingbot", "Disallow:"].join("\n")
    );
    actual.should.have.string(
      ["User-agent: *", "Disallow: /robocop_copyright_info"].join("\n")
    );

    parse(actual).should.eql({
      nsa: ["/"],
      "*": ["/robocop_copyright_info"],
      coolbot: ["/secret_codes.txt", "/cool_burrito_photo.jpg"],
      everythingbot: [],
    });
  });

  it("builds an empty robots.txt", function () {
    var expected = ["User-agent: *", "Disallow:"].join("\n");
    robots.build().should.eql(expected);
    robots.build({}).should.eql(expected);
  });
});
