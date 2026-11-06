import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const files = [
  'README.md',
  '.env.example',
  '.gitignore',
  'package-lock.json',
  'DECISOES.md',
  'api/README.md',
];

for (const file of files) {
  assert.ok((await stat(new URL(file, root))).isFile(), `Arquivo ausente: ${file}`);
}

const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
assert.deepEqual(manifest.workspaces, ['backend', 'frontend']);

for (const workspace of manifest.workspaces) {
  const packagePath = new URL(`${workspace}/package.json`, root);
  const entry = JSON.parse(await readFile(packagePath, 'utf8'));
  assert.equal(entry.private, true);
  assert.equal(entry.type, 'module');
}

const example = await readFile(new URL('.env.example', root), 'utf8');
assert.match(example, /^GEMINI_API_KEY=$/m, 'O exemplo deve conter a chave vazia.');
console.log('Estrutura fundamental do projeto verificada.');
