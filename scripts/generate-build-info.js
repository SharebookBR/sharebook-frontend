// Gera src/environments/version.ts com o commit atual, pra exibir no rodapé
// e permitir confirmar visualmente qual versão está no ar num ambiente.
// Roda antes de cada build (ver hooks "prebuild*" no package.json).
const fs = require('fs');
const path = require('path');

const GIT_DIR = path.join(__dirname, '..', '.git');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'environments', 'version.ts');

function readGitCommit() {
  try {
    const head = fs.readFileSync(path.join(GIT_DIR, 'HEAD'), 'utf8').trim();
    if (!head.startsWith('ref:')) {
      return head; // HEAD desanexado: já é o SHA
    }

    const ref = head.slice('ref:'.length).trim();
    const refPath = path.join(GIT_DIR, ref);
    if (fs.existsSync(refPath)) {
      return fs.readFileSync(refPath, 'utf8').trim();
    }

    // Clones rasos/recém-feitos costumam empacotar as refs em vez de criar o arquivo solto.
    const packedRefsPath = path.join(GIT_DIR, 'packed-refs');
    if (fs.existsSync(packedRefsPath)) {
      const line = fs
        .readFileSync(packedRefsPath, 'utf8')
        .split('\n')
        .find((l) => l.endsWith(` ${ref}`));
      if (line) {
        return line.split(' ')[0];
      }
    }
  } catch {
    // sem .git (ex.: contexto de build sem histórico) — cai no fallback abaixo.
  }
  return null;
}

const sha = process.env.GIT_COMMIT_SHA || readGitCommit();
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
