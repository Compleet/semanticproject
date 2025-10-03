const fetch = global.fetch || require('node-fetch');
const cheerio = require('cheerio');

const BASE = process.env.BASE_URL || 'http://localhost:8000';

async function ok(res, name){
  if (!res.ok) throw new Error(`${name} returned ${res.status}`);
  return res;
}

async function run(){
  console.log('Base URL:', BASE);
  const root = await ok(await fetch(BASE), 'root');
  const html = await root.text();
  const $ = cheerio.load(html);
  const title = $('h1').first().text().trim();
  console.log('Found H1:', title);
  if (title !== 'PKM Semantic Vault') throw new Error('Title mismatch');

  // manifest
  const manifestResp = await ok(await fetch(`${BASE}/vault/manifest.json`), 'manifest');
  const list = await manifestResp.json();
  console.log('Manifest items:', list.length);
  if (!Array.isArray(list) || list.length < 9) throw new Error('Manifest size unexpected');

  // fetch first file and check frontmatter
  const first = list[0];
  const fileRes = await ok(await fetch(`${BASE}/vault/${first}`), `file ${first}`);
  const text = await fileRes.text();
  if (!text.includes('---')) throw new Error('No frontmatter in first file');
  console.log('First file frontmatter found');

  // check ability to load one of the UI assets
  const indexResp = await ok(await fetch(`${BASE}/index.html`), 'index');
  console.log('index.html OK');

  console.log('All checks passed');
}

run().catch(e=>{console.error('CHECKS FAILED:', e.message); process.exit(2)});
