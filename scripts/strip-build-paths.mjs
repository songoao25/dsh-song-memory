// Strips developer-machine absolute paths from build artifacts in lib/.
// The bundler (tsdown/esbuild) injects `//#region \0dsh-mnemon-css:<abs-path>.module.css.mjs`
// markers into the client bundle. They are inert comments but leak the
// builder's absolute paths (and username) into published packages.
//
// This script is part of `pnpm run build`; it rewrites those markers to a
// neutral basename form so packages never carry machine-specific paths.

import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECT_ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const LIB_DIR = join(PROJECT_ROOT, 'lib')

const TEXT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.d.ts'])
const CSS_REGION = /(\\0dsh-mnemon-css:)\/[^\s"'`]*\/([^/\s"'`]+\.module\.css\.mjs)/g

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(full))
    else if (TEXT_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf('.')))) files.push(full)
  }
  return files
}

function stripPaths(content) {
  // Neutralize bundler CSS-region markers, keeping only the css file basename.
  return content.replace(CSS_REGION, (match, prefix, name) => `${prefix}${name}`)
}

let changedFiles = 0
let changedMatches = 0

for (const file of await walk(LIB_DIR)) {
  const original = await readFile(file, 'utf8')
  const stripped = stripPaths(original)
  if (stripped !== original) {
    await writeFile(file, stripped)
    changedFiles += 1
    changedMatches += (original.match(CSS_REGION) ?? []).length
    console.log(`stripped ${basename(file)}`)
  }
}

console.log(`Stripped ${changedMatches} absolute-path marker(s) from ${changedFiles} file(s) in lib/`)
