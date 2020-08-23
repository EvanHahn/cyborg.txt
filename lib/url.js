module.exports = function url(uri) {
  var url;
  try {
    url = new URL(uri);
  } catch (err) {
    throw new Error("Cannot parse URL " + uri);
  }

  url.pathname = "/robots.txt";
  url.search = "";
  url.hash = "";

  return url.href;
};
