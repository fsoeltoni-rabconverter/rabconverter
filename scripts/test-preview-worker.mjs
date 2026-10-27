import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const worker = await readFile(new URL("../preview/worker.js", import.meta.url), "utf8");
const htmlStart = worker.indexOf("const html = String.raw`");
assert.notEqual(htmlStart, -1, "Worker should embed the preview HTML");
const templateStart = htmlStart + "const html = String.raw`".length;
const templateEnd = worker.indexOf("`;", templateStart);
assert.notEqual(templateEnd, -1, "Embedded HTML template should close");

const html = worker.slice(templateStart, templateEnd);
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter((match) => !/type=["']application\/ld\+json["']/i.test(match[1]))
  .map((match) => match[2]);
const appScript = scripts.at(-1);
assert.ok(appScript, "Preview should contain an application script");

test("preview application JavaScript parses", () => {
  assert.doesNotThrow(() => new Function(appScript));
});

test("every named click handler referenced by the preview has a definition", () => {
  const bindings = [
    ["resetFile", /document\.getElementById\(['"]remove['"]\)\.addEventListener\(['"]click['"],\s*resetFile\)/],
    ["runPreflight", /preflight\.addEventListener\(['"]click['"],\s*runPreflight\)/],
    ["runLocalOcr", /localOcr\.addEventListener\(['"]click['"],\s*runLocalOcr\)/],
  ];
  for (const [name, binding] of bindings) {
    assert.match(appScript, binding, `Missing click listener for ${name}`);
    assert.match(appScript, new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`), `Click handler ${name} must be defined`);
  }
});

test("AI conversion button is primary and wired through document delegation", () => {
  assert.match(html, /id="convert-xlsx"/);
  assert.match(html, /Konversi dengan AI &amp; Unduh Excel/);
  assert.match(appScript, /document\.addEventListener\(['"]click['"],\s*event\s*=>/);
  assert.match(appScript, /closest\(['"]#convert-xlsx['"]\)/);
  assert.match(appScript, /async function convertAndDownloadExcel\s*\(/);
  assert.match(appScript, /AI_EXTRACTION_COMPLETE/);
});
