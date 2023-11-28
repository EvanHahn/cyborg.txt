var build = require("./build");

module.exports = function middleware(options) {
  var body = build(options);

  return function cyborg(req, res, next) {
    if (req.url == "/robots.txt") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(body);
    } else {
      next();
    }
  };
};
