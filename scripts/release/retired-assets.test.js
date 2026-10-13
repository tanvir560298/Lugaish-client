import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertRetiredAssetsAbsent, RETIRED_PUBLIC_ASSETS } from "./retired-assets.js";

test("build gate rejects each retired public asset but preserves private archival and current campus assets", async () => {
  const root = await mkdtemp(join(tmpdir(), "lugaish-public-media-gate-"));
  try {
    const publicDirectory = join(root, "public");
    await mkdir(join(publicDirectory, "audio"), { recursive: true });
    await mkdir(join(root, ".private-archive/audio"), { recursive: true });
    await writeFile(join(root, ".private-archive", RETIRED_PUBLIC_ASSETS[0]), "preserved history");
    await writeFile(join(publicDirectory, "audio/library-rain.mp3"), "current licensed ambience");
    assert.doesNotThrow(() => assertRetiredAssetsAbsent(publicDirectory));
    for (const path of RETIRED_PUBLIC_ASSETS) {
      const asset = join(publicDirectory, path);
      await mkdir(join(asset, ".."), { recursive: true });
      await writeFile(asset, "retired test fixture");
      assert.throws(() => assertRetiredAssetsAbsent(publicDirectory), /Retired course media/);
      await rm(asset);
    }
    assert.doesNotThrow(() => assertRetiredAssetsAbsent(publicDirectory));
  } finally { await rm(root, { recursive: true, force: true }); }
});
