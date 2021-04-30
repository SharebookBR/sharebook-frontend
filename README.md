# PRIMEIROS PASSOS DEVELOPER FRONTEND

## 1 - CONHEÇA O PROJETO SHAREBOOK

https://www.linkedin.com/pulse/projeto-sharebook-raffaello-damgaard/

## 2 - ENTRE NO SLACK

https://join.slack.com/t/sharebookworkspace/shared_invite/enQtMzQ2Nzc5OTk3MDc4LTZlMmJlMjA3NGE1NDczN2QxYzc2ZWZhM2UxMzFkMDIyYjliMGI3YzdlYzg2ZjZhYjQ2YWY1ZTUyZGViNzViOWQ

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

### 5 MISSÃO CUMPRIDA. VC AJUDOU O PROJETO. ❤️

## Observações:

Verifique a versão do Node - Recomendamos Versão 10.x.x  
Versões recentes tem apresentado instabilidades com pacotes presente no projeto.  
Use o Angular 7+

# Rodar o app pela primeira vez

```bash
npm install

npm start

# crie seu primeiro componente. Exemplo.
ng generate component book/list nomeDoComponente
```

# Rodar o app pela primeira vez com Docker

Os comandos abaixo irão rodar o frontend em container docker com hot reload, ou seja, qualquer alteração feita no front será automaticamente atualizada.

```bash
# Criando imagem e rodando o container com Backend DEV
docker-compose up -d --build

# Criando imagem e rodando o container com Backend LOCAL
docker-compose -f docker-compose-local.yml up -d --build

# Rodando os testes unitários
docker-compose run --rm sharebook npm run test

# Parando o container
docker-compose stop

# Parando e eliminando o container
docker-compose down
```

## Acessando o frontend no navegador

http://localhost:4200

## API no ambiente de dev

http://dev.sharebook.com.br/swagger/

## HTML Responsivo original - Bootstrap 4

http://www.devfrontend.com.br/models/sharebook-original/index.html
