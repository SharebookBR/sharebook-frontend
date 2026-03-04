# AGENTS.md

## Projeto e stack
- Frontend Angular 13.
- Recomenda-se Node.js 14.x para evitar incompatibilidades com dependências legadas.

## Comandos principais
- Build: `npm run build-dev`
- App (API DEV): `npm start`
- App (API local): `npm run start-local`
- Testes unitários: `npm test`

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

## Qualidade
- Sempre rodar ao menos build e testes antes de concluir alterações.
- Se os testes envolverem coverage, manter reporter `coverage` configurado no Karma.
