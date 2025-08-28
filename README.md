# PRIMEIROS PASSOS DEVELOPER FRONTEND

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

### 4.4 LOGIN DE TESTES EM DEV

Caso você necessite logar para testar localmente o projeto, pode utilizar o login abaixo:\
Login: vagner@sharebook.com\
Senha: 132456

### 5 MISSÃO CUMPRIDA. VC AJUDOU O PROJETO. ❤️

## Tecnologias utilizadas

- **Angular**: 13.3.12
- **Angular CLI**: 13.2.5
- **TypeScript**: 4.5.5
- **Angular Material**: 13.3.9
- **Bootstrap**: 4.5.0
- **Node.js**: Recomendado 14.x (versões superiores podem apresentar warnings)

## Observações:

Verifique a versão do Node - Recomendamos Versão 14.
Outras versões tem apresentado instabilidades com pacotes presente no projeto.

# Rodar o app pela primeira vez

## Pré-requisitos
- Node.js 14.x ou superior (versão 20+ pode apresentar warnings mas funciona)
- npm ou yarn

## Instalação

```bash
# Instalar dependências (necessário usar --legacy-peer-deps devido a conflitos de versão)
npm install --legacy-peer-deps

# Iniciar o servidor de desenvolvimento
npm start

# Ou usar comando Angular CLI via npx (sem instalação global)
npx ng serve
```

## Comandos úteis

```bash
# Criar novo componente
npx ng generate component nome-do-componente

# Build para desenvolvimento
npm run build-dev

# Build para produção
npm run build-prod

# Executar testes
npm test

# Executar linting
npm run lint
```

## Angular CLI Global vs Local

**❌ NÃO é necessário instalar o Angular CLI globalmente:**
```bash
# Evite este comando:
npm install -g @angular/cli@13.2.5
```

**✅ Use npx ou npm scripts:**
```bash
# Via npm scripts (recomendado)
npm start
npm run build-dev
npm test

# Via npx (se precisar de comandos ng específicos)
npx ng serve
npx ng generate component exemplo
npx ng build --prod
```

## Troubleshooting - Problemas Comuns

### ❌ Erro: "npm ERR! ERESOLVE unable to resolve dependency tree"
**Solução:**
```bash
npm install --legacy-peer-deps
```

### ❌ Erro: "ng: command not found"
**Solução:** Use `npx ng` ao invés de `ng`, ou execute via npm scripts:
```bash
npx ng serve    # ao invés de ng serve
npm start       # ou use o script do package.json
```

### ❌ Warnings sobre versão do Node
Se você estiver usando Node.js 16+ e receber warnings, isso é normal. O projeto funciona mas recomendamos Node 14.x para evitar avisos.

### ❌ Problemas com dependências após git pull
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

# Rodar o app pela primeira vez com Docker

Os comandos abaixo irão rodar o frontend em container docker com hot reload, ou seja, qualquer alteração feita no front será automaticamente atualizada.

```bash
# Criando imagem e rodando o container com Backend DEV
docker-compose up -d --build

# Criando imagem e rodando o container com Backend LOCAL
docker-compose -f docker-compose-local.yml up -d --build

# Rodando todos os testes unitários
docker-compose run --rm sharebook npm run test

# Para rodar o teste unitário dentro do container e verificar os possíveis erros
docker exec -it sharebook-frontend-dev bash
npm run test-debug
acessar a URL que aparece no console: http://localhost:9876/
clicar no botão DEBUG

# Parando o container
docker-compose stop

# Parando e eliminando o container
docker-compose down
```

## Acessando o frontend no navegador

http://localhost:4200

## API no ambiente de dev

https://dev.sharebook.com.br/swagger/
