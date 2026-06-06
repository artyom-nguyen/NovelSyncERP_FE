import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".nuxt", ".output", "node_modules", ".git"]);
const ignoredPaths = ["public/vendor"];
const checkedExtensions = new Set([
  ".vue",
  ".ts",
  ".js",
  ".mjs",
  ".cjs",
  ".css",
  ".html",
  ".json",
  ".md",
]);

const chars = {
  AWithTilde: String.fromCharCode(0x00c3),
  AWithDiaeresis: String.fromCharCode(0x00c4),
  aWithAcute: String.fromCharCode(0x00e1),
  masculineOrdinal: String.fromCharCode(0x00ba),
  rightGuillemet: String.fromCharCode(0x00bb),
  AE: String.fromCharCode(0x00c6),
  AWithCircumflex: String.fromCharCode(0x00c2),
  AWithRing: String.fromCharCode(0x00c5),
  eth: String.fromCharCode(0x00f0),
  YWithDiaeresis: String.fromCharCode(0x0178),
};
const mojibakePattern = new RegExp(
  [
    `${chars.AWithTilde}.`,
    `${chars.AWithDiaeresis}.`,
    `${chars.aWithAcute}${chars.masculineOrdinal}`,
    `${chars.aWithAcute}${chars.rightGuillemet}`,
    chars.AE,
    chars.AWithCircumflex,
    chars.AWithRing,
    `${chars.eth}${chars.YWithDiaeresis}`,
  ].join("|"),
  "g",
);
const failures = [];

const extensionOf = (fileName) => {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex) : "";
};

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;

    const fullPath = join(dir, entry);
    const relativePath = relative(root, fullPath).replaceAll("\\", "/");
    if (ignoredPaths.some((path) => relativePath.startsWith(path))) continue;

    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!checkedExtensions.has(extensionOf(entry))) continue;

    const content = readFileSync(fullPath, "utf8");
    mojibakePattern.lastIndex = 0;

    if (mojibakePattern.test(content)) {
      failures.push(relative(root, fullPath));
    }
  }
};

walk(root);

if (failures.length) {
  console.error("Detected possible mojibake/encoding issues:");
  for (const file of failures) console.error(`- ${file}`);
  process.exit(1);
}

console.log("Encoding check passed.");
