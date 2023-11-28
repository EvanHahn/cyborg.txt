export const DEFAULTS = ["User-agent: *", "Disallow:"].join("\n");

export function build(options) {
  options = options || {};

  const bots = Object.keys(options);
  bots.sort(function (a) {
    return a === "*";
  });

  if (!bots.length) {
    return build({ "*": [] });
  }

  return bots
    .map(function (bot) {
      const firstLine = "User-agent: " + bot + "\n";
      let disallowList;

      if (options[bot].length) {
        disallowList = options[bot]
          .map(function (disallow) {
            let result = "Disallow: ";
            if (disallow[0] !== "/") {
              result += "/";
            }
            result += disallow;
            return result;
          })
          .join("\n");
      } else {
        disallowList = "Disallow:";
      }

      return firstLine + disallowList;
    })
    .join("\n\n");
}

export function middleware(options) {
  const body = build(options);

  return function cyborg(req, res, next) {
    if (req.url == "/robots.txt") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(body);
    } else {
      next();
    }
  };
}

export function url(uri) {
  let url;
  try {
    url = new URL(uri);
  } catch (err) {
    throw new Error("Cannot parse URL " + uri);
  }

  url.pathname = "/robots.txt";
  url.search = "";
  url.hash = "";

  return url.href;
}
