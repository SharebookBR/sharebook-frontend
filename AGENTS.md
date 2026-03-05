# AGENTS.md

## Projeto e stack
- Frontend Angular 13.
- Recomenda-se Node.js 14.x para evitar incompatibilidades com dependências legadas.

## Comandos principais
- Build: `npm run build-dev`
- App (API DEV): `npm start`
- Testes unitários: `npm test`

## Playbook: primeiro pedido "rodar testes"
- Objetivo: evitar tentativa-e-erro no ambiente sandbox.
- Sequência padrão:
  1. `npm install`
  2. `npm test -- --watch=false`
  3. Se falhar por browser/headless/lib nativa, seguir `Troubleshooting testes`.
  4. Após teste verde, validar build com `npm run build-dev`.
- Não sobrescrever browser manualmente no comando de teste.
  - Use sempre o script do projeto (`npm test`) que já aponta para `ChromeHeadlessCI`.
  - Evitar `--browsers=ChromeHeadless` (pode quebrar quando rodar como root/sandbox).

## Ambientes
- `npm start` usa `src/environments/environment.ts` e aponta para API DEV.
- `npm run start-local` usa `src/environments/environment.local.ts` e aponta para backend local (`http://localhost:8000/api`).

## Credenciais de teste (DEV)
- Usuário: `vagner@sharebook.com`
- Senha: `123456`


## Login DEV (comando validado)
```bash
curl --location 'https://api-dev.sharebook.com.br/api/Account/Login' \
--header 'Content-Type: application/json' \
--header 'x-requested-with: web' \
--data-raw '{
	"email": "vagner@sharebook.com",
	"password": "123456"
}'
```

## Dicas operacionais
- Em ambientes com proxy corporativo, comandos de CLI para APIs externas podem falhar, mesmo quando o acesso via browser funciona.
- Para inspeção visual e feedback rápido, o MCP browser/playwright costuma funcionar bem com o frontend em `--host 0.0.0.0`.

## Troubleshooting testes
- Sintoma: `npm test` falha por ausência de browser headless ou libs nativas do Chromium.
- Passos que destravam o ambiente (ordem recomendada):
  1. `npm install -D puppeteer --legacy-peer-deps`
  2. `apt-get update && apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 libnss3 libxss1 libasound2t64 libgbm1`
  3. `npm test`
- Diagnóstico rápido por erro:
  - `No binary for ChromeHeadless` -> instalar `puppeteer` (passo 1).
  - `error while loading shared libraries` -> instalar libs nativas (passo 2).
  - Falha com `--no-sandbox` ausente -> garantir uso do launcher `ChromeHeadlessCI` via `npm test`.


## Qualidade
- Sempre rodar ao menos build e testes antes de concluir alterações.
- Se os testes envolverem coverage, manter reporter `coverage` configurado no Karma.

## Princípios sobre criação de testes

- **Teste unitário só fica se proteger regra de negócio ou fluxo crítico de jornada.** Se não muda decisão de produto nem evita regressão real, não merece custo de manutenção.
- **`should create` isolado é ruído, não cobertura.** Evitar specs de existência sem assert de comportamento observável.
- **Preferir poucos testes de alto sinal.** Priorizar submit de formulário, transição de estado, contrato com serviço externo e ações críticas (ex.: abrir modal correto com payload correto).
- **Template é detalhe, fluxo é contrato.** Não acoplar teste a estrutura de HTML quando o objetivo é validar intenção funcional.
