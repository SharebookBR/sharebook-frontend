// Gera src/environments/version.ts com o commit atual, pra exibir no rodapé
// e permitir confirmar visualmente qual versão está no ar num ambiente.
// Roda antes de cada build (ver hooks "prebuild*" no package.json).
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(REPO_ROOT, 'src', 'environments', 'version.ts');

// Plataformas de CI/CD costumam injetar o SHA do commit numa env var própria.
// Cobrimos os nomes mais comuns como primeira fonte de verdade, antes de
// tentar ler o .git diretamente.
const ENV_CANDIDATES = [
  'GIT_COMMIT_SHA',
  'SOURCE_COMMIT',
  'COOLIFY_COMMIT_SHA',
  'GIT_COMMIT',
  'GITHUB_SHA',
  'CI_COMMIT_SHA',
];

function resolveGitDir(startDir) {
  const gitPath = path.join(startDir, '.git');
  if (!fs.existsSync(gitPath)) {
    return { kind: 'missing', path: gitPath };
  }

  const stat = fs.statSync(gitPath);
  if (stat.isDirectory()) {
    return { kind: 'dir', path: gitPath };
  }

  // Worktree/submódulo: .git é um arquivo com "gitdir: <path-real>".
  const pointer = fs.readFileSync(gitPath, 'utf8').trim();
  const match = pointer.match(/^gitdir:\s*(.+)$/);
  if (match) {
    const resolved = path.isAbsolute(match[1]) ? match[1] : path.join(startDir, match[1]);
    return { kind: 'gitlink', path: resolved };
  }

  return { kind: 'unknown-file', path: gitPath };
}

function readRefFile(gitDir, ref) {
  const refPath = path.join(gitDir, ref);
  if (fs.existsSync(refPath)) {
    return fs.readFileSync(refPath, 'utf8').trim();
  }

  // Clones rasos/recém-feitos costumam empacotar as refs em vez de criar o arquivo solto.
  const packedRefsPath = path.join(gitDir, 'packed-refs');
  if (fs.existsSync(packedRefsPath)) {
    const line = fs
      .readFileSync(packedRefsPath, 'utf8')
      .split('\n')
      .find((l) => l.endsWith(` ${ref}`));
    if (line) {
      return line.split(' ')[0];
    }
  }
  return null;
}

function readGitCommitFromFilesystem() {
  const { kind, path: gitDir } = resolveGitDir(REPO_ROOT);
  console.log(`[build-info] .git detectado como: ${kind} (${gitDir})`);

  if (kind === 'missing' || kind === 'unknown-file') {
    return null;
  }

  try {
    const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
    if (!head.startsWith('ref:')) {
      return head; // HEAD desanexado: já é o SHA
    }
    return readRefFile(gitDir, head.slice('ref:'.length).trim());
  } catch (err) {
    console.log(`[build-info] falha lendo .git pelo filesystem: ${err.message}`);
    return null;
  }
}

function readGitCommitFromCli() {
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return null; // binário git ausente, ou diretório não é um repo git de verdade
  }
}

function resolveCommit() {
  for (const envVar of ENV_CANDIDATES) {
    if (process.env[envVar]) {
      console.log(`[build-info] commit obtido da env var ${envVar}`);
      return process.env[envVar];
    }
  }

  return readGitCommitFromFilesystem() || readGitCommitFromCli();
}

const sha = resolveCommit();
const commit = sha ? sha.slice(0, 7) : 'dev-local';
const builtAt = new Date().toISOString();

const content = `// Gerado automaticamente por scripts/generate-build-info.js — não editar à mão.
export const BUILD_INFO = {
  commit: '${commit}',
  builtAt: '${builtAt}',
};
`;

fs.writeFileSync(OUTPUT_FILE, content);
console.log(`[build-info] commit=${commit} builtAt=${builtAt}`);
