import test from "node:test";
import assert from "node:assert/strict";
import {
  createYouTubeLoader,
  placeReadyYouTubeFrame,
} from "../src/classroom/youtubeApi.js";
function fixture() {
  const scripts = [],
    timers = new Set(),
    window = {};
  const document = {
    createElement: () => ({
      remove() {
        this.removed = true;
      },
    }),
    head: {
      appendChild(s) {
        scripts.push(s);
      },
    },
  };
  const load = createYouTubeLoader({
    window,
    document,
    setTimeout: (fn) => {
      timers.add(fn);
      return fn;
    },
    clearTimeout: (fn) => timers.delete(fn),
  });
  return { scripts, timers, window, load };
}
test("failed and timed-out provider loads restore the prior callback and permit a clean retry", async () => {
  const f = fixture(),
    original = () => {};
  f.window.onYouTubeIframeAPIReady = original;
  const one = f.load();
  assert.equal(f.load(), one);
  f.scripts[0].onerror();
  await assert.rejects(one, /could not load/);
  assert.equal(f.window.onYouTubeIframeAPIReady, original);
  assert.equal(f.timers.size, 0);
  const two = f.load();
  [...f.timers][0]();
  await assert.rejects(two, /too long/);
  assert.equal(f.window.onYouTubeIframeAPIReady, original);
  assert.equal(f.scripts[1].removed, true);
  const three = f.load();
  f.window.YT = { Player: class {} };
  f.window.onYouTubeIframeAPIReady();
  assert.equal(await three, f.window.YT);
  assert.equal(f.window.onYouTubeIframeAPIReady, original);
});
test("provider readiness completes even if a prior callback throws", async () => {
  const f = fixture();
  const original = () => {
    throw Error("other consumer");
  };
  f.window.onYouTubeIframeAPIReady = original;
  const load = f.load();
  f.window.YT = { Player: class {} };
  f.window.onYouTubeIframeAPIReady();
  assert.equal(await load, f.window.YT);
  assert.equal(f.window.onYouTubeIframeAPIReady, original);
});
test("late player readiness reconciles the latest theater destination without duplicating or reloading the iframe", () => {
  const initial = {
      isConnected: true,
      moveBefore(frame) {
        frame.parentElement = this;
      },
    },
    theater = { ...initial };
  const frame = { parentElement: initial },
    player = { getIframe: () => frame };
  assert.equal(placeReadyYouTubeFrame(null, theater), false);
  assert.equal(placeReadyYouTubeFrame(player, theater), true);
  assert.equal(frame.parentElement, theater);
  assert.equal(placeReadyYouTubeFrame(player, initial), true);
  assert.equal(placeReadyYouTubeFrame(player, { isConnected: false }), false);
  assert.equal(placeReadyYouTubeFrame(player, {}), false);
});
