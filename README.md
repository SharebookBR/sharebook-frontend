# PRIMEIROS PASSOS DEVELOPER FRONTEND

<!-- teste de commit/push automático: 2026-04-10 -->
<!-- teste de auto-deploy Coolify (dev) apos troca da source GitHub App: 2026-09-19 -->

## 1 - CONHEÇA O PROJETO SHAREBOOK

https://www.linkedin.com/pulse/projeto-sharebook-raffaello-damgaard/

## 2 - ENTRE NO SLACK

https://join.slack.com/t/sharebookworkspace/shared_invite/zt-4fb3uu8m-VPrkhzdI9u3lsOlS1OkVvg

### 2.2 - LÁ NO SLACK, ENTRE NO CANAL #FRONTEND

- Se apresente. Nome, cidade, profissão, e principais habilidades.
- Pergunte sobre as tarefas em aberto.
- Troque uma ideia com o time técnico. Comente como planeja solucionar. Ouça os conselhos dos devs mais experientes. Esse alinhamento é super importante pra aumentar significativamente as chances do seu PULL REQUEST ser aprovado depois.

## 3 - FAÇA PARTE DA EQUIPE NO TRELLO

https://trello.com/invite/sharebook6/928f21ef82592b5edafde06f171d338b

### 3.2 - PEGUE UMA TAREFA NO TRELLO.

- https://trello.com/b/QTdWPYhl/sharebook
- Coloque no seu nome e mova para DOING.

## 4 - GITHUB

### 4.1 FAÇA UM FORK DO REPOSITÓRIO

https://github.com/SharebookBR/frontend

### 4.2 INSTALE OS PLUGINS RECOMENDADOS

Para padronizarmos a formatação do código, é necessário instalar o pluguin no VSCode chamado "Prettier - Code Formatter".

Outros pluguins que recomendamos para evitar possíveis erros: TSLint, ESLint e JSHint.

### 4.3 ESCREVA CÓDIGO

Hora de colocar a mão na massa. A parte mais divertida, trabalhar no código-fonte. Depois de concluir e testar, envie sua PULL REQUEST para a branch DEVELOP e aguarde ser aprovado.

### 4.4 LOGIN PARA TESTES

Não há mais ambiente de dev público (`dev.sharebook.com.br` e `api-dev.sharebook.com.br` estão desligados). Para testar com login, rode o [backend](https://github.com/SharebookBR/sharebook-backend) localmente e crie uma conta pelo próprio site em `http://localhost:4200`.

### 5 MISSÃO CUMPRIDA. VC AJUDOU O PROJETO. ❤️

## Tecnologias utilizadas

- **Angular** e **Angular CLI**: 22.1
- **Angular Material**: 22.1
- **TypeScript**: 6.0
- **Bootstrap**: 4.6
- **Node.js**: 24 (`>=24.15.0 <25`, conforme `engines` do `package.json`)
- **npm**: 11 ou superior

O build ainda usa os builders Webpack (`@angular-devkit/build-angular`). O CLI avisa que estão depreciados; os avisos são esperados e não impedem nada.

# Rodar o app pela primeira vez

```bash
# Instalar dependências (--legacy-peer-deps é necessário por conflitos de peer deps)
npm ci --legacy-peer-deps
```

Escolha o modo conforme a API que você quer usar:

| Comando | SSR | API usada | Quando usar |
|---|---|---|---|
| `npm run start-local` | não | `http://localhost:8000/api` (backend local) | Dia a dia, com hot reload |
| `npm run dev:ssr` | sim | `http://localhost:8000/api` (backend local) | Validar renderização no servidor contra o backend local |
| `npm start` | sim | `https://api.sharebook.com.br/api` (**produção**) | Conferir o front contra dados reais. Cuidado: tudo o que você fizer logado acontece em produção |

Todos abrem em http://localhost:4200. A configuração `local` também desliga o Google Analytics, então a navegação local não suja as métricas.

```bash
# crie seu primeiro componente. Exemplo.
npx ng generate component book/list nomeDoComponente
```

## Testes

```bash
# Testes unitários (Karma, Chrome headless). É o mesmo gate que roda no build de produção.
npm test

# Testes unitários com o Chrome aberto para depurar (abrir http://localhost:9876/ e clicar em DEBUG)
npm run test-debug

# Testes end-to-end (Playwright)
npm run e2e
```

## Build igual ao de produção

```bash
npm run build:ssr     # build do browser + build do servidor SSR, em dist/angular/
npm run serve:ssr     # sobe o servidor SSR em http://localhost:4000 (ou na porta da variável PORT)
```

---

# Colinha docker VPS

O `devops/Dockerfile` é o da produção: roda `npm test` como gate, faz o `build:ssr` e serve o SSR na porta 80. Não tem hot reload; para desenvolver, use os comandos `npm` acima.

```bash
# Build da imagem
docker build -t sharebook-front -f devops/Dockerfile .

# Run, publicando a porta 80 do container em http://localhost:4200
docker run -d -p 4200:80 --name sharebook-front-container sharebook-front
```
