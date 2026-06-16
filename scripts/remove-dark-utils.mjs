import { promises as fs } from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'src');
const exts = ['.js', '.jsx', '.ts', '.tsx', '.css', '.md'];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const res = path.resolve(dir, e.name);
    if (e.isDirectory()) await walk(res);
    else if (exts.includes(path.extname(e.name))) await processFile(res);
  }
}

async function processFile(file) {
  let content = await fs.readFile(file, 'utf8');
  const original = content;
  // Remove tokens starting with dark: up to whitespace or quote
  content = content.replace(/\bdark:[^\s'"`]+/g, '');
  // Collapse multiple spaces
  content = content.replace(/ {2,}/g, ' ');
  // Clean up className strings with double spaces before closing quote
  content = content.replace(/\s+(["'])/g, '$1');

  if (content !== original) {
    await fs.writeFile(file, content, 'utf8');
    console.log('Updated', file);
  }
}

(async () => {
  try {
    await walk(root);
    console.log('Done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
