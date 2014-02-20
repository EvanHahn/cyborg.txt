Cyborg.txt: robots.txt stuff for Node
=====================================

A collection of utilities for all your [robots.txt](http://www.robotstxt.org/) needs, like building a web crawler or your own robots-serving website.

Installation
------------

    npm install cyborg.txt

For webcrawlers
---------------

```javascript
var robots = require('cyborg.txt');

// Given a URL, where's the corresponding robots.txt file?
robots.url('http://example.com'); // => http://example.com/robots.txt
robots.url('http://example.com/some/path/to/file.jpg'); // => http://example.com/robots.txt

// Am I allowed to view this resource?
// This loads the appropriate robots.txt, unless it's cached.
// Caching respects the Expires HTTP header.
var bot = new robots.Bot({
  agent: 'MyEvilWebcrawler',
  maxAge: 5000 // cache robots.txt for 5 seconds
});
bot.allows('http://example.com', function() {
  console.log('Example.com is allowed!');
});
bot.disallows('http://example.com/not_allowed.jpg', function() {
  console.log('this is not allowed!');
});
```

For webmasters
--------------

```javascript
var robots = require('cyborg.txt');

// Build the body of a robots.txt

robots.build({
    '*': ['/secrets'],
    'another-web-crawler': ['cool_folder/hiddenA'], // you can ignore the slash at the start
    'let-everything-through-crawler': [] // allow anything
    'CoolSearchEngine': ['/hidden_picture.jpg', '/something_else.txt'],
});

  /*
  User-agent: *
  Disallow: /secrets

  User-agent: CoolSearchEngine
  Disallow: /hidden_picture.jpg

  User-agent: let-everything-through-crawler
  Disallow:

  User-agent: another-web-crawler
  Disallow: /cool_folder/hiddenA
  Disallow: /cool_folder/hidden

  */

robots.build(); // allow anything through

  /*
  User-agent: *
  Disallow:
  */

// Use as Connect middleware (works with Express)

var connect = require('connect');
var app = connect();
app.use(robots.middleware({  // takes same options as robots.build
  '*': ['/secret_lair']
});
app.listen(1337);
```
