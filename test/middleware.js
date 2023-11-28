import * as assert from "node:assert";
import test from "node:test";
import * as robots from "../cyborg.js";
import connect from "connect";
import request from "supertest";
import { parse } from "./helpers.js";

test("middleware serves robots.txt", async () => {
  const app = connect();
  app.use(
    robots.middleware({
      nsa: ["/"],
      "*": ["robocop_copyright_info"],
      coolbot: ["/secret_codes.txt", "cool_burrito_photo.jpg"],
      everythingbot: [],
    }),
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
      ].join("\n"),
    ),
  );
  assert.ok(
    text.includes(["User-agent: everythingbot", "Disallow:"].join("\n")),
  );
  assert.ok(
    text.includes(
      ["User-agent: *", "Disallow: /robocop_copyright_info"].join("\n"),
    ),
  );

  assert.deepStrictEqual(parse(text), {
    nsa: ["/"],
    "*": ["/robocop_copyright_info"],
    coolbot: ["/secret_codes.txt", "/cool_burrito_photo.jpg"],
    everythingbot: [],
  });
});

test("middleware ignores requests to other paths or methods", async () => {
  const app = connect();
  app.use(robots.middleware());
  app.use((_req, res) => res.end("foo"));

  await request(app).get("/bar").expect("foo");
  await request(app).post("/robots.txt").expect("foo");
});
