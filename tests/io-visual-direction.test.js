const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Surviv Lite .io direction is wired into markup, styling, and canvas rendering", () => {
  const html = read("index.html");
  const css = read("styles.css");
  const js = read("game.js");

  assert.match(html, /id="leaderboard"/);
  assert.match(css, /\.leaderboard\b/);
  assert.match(css, /\.quick-stats\b/);
  assert.match(css, /--io-grass/);
  assert.match(js, /const IO_THEME/);
  assert.match(js, /function drawIoGrid/);
  assert.match(js, /function updateLeaderboard/);
  assert.match(js, /drawIoGrid\(\)/);
  assert.match(js, /updateLeaderboard\(\)/);
});
