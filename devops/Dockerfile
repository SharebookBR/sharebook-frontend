# Build Stage (inclui gate de testes)
FROM public.ecr.aws/docker/library/node:20-bookworm-slim AS build
WORKDIR /app

# Chromium para o Karma headless (npm test)
RUN apt-get update && apt-get install -y chromium --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências (inclui devDeps necessárias ao teste e ao build)
# --include=dev + PUPPETEER_SKIP_DOWNLOAD: garante devDeps mesmo com NODE_ENV=production
# e evita baixar o Chrome do Puppeteer (usamos o Chromium do sistema).
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY package*.json ./
RUN npm ci --legacy-peer-deps --include=dev

# Copia código
COPY . .

# Gate: roda a suíte de testes antes de buildar (falha => deploy bloqueado)
ENV CHROME_BIN=/usr/bin/chromium
RUN npm test

# Build SSR
RUN npm run build:ssr

# Runtime Stage
FROM public.ecr.aws/docker/library/node:20-alpine
WORKDIR /app

# Copia apenas os artefatos necessários do estágio de build
COPY --from=build /app/dist/angular/ /app/dist/angular/
COPY --from=build /app/package*.json /app/

# Instala apenas as dependências de produção para manter a imagem leve
RUN npm ci --only=production --legacy-peer-deps

# Porta padrão do Sharebook
ENV PORT=80
EXPOSE 80

# Comando para iniciar o servidor SSR
CMD ["node", "dist/angular/server/main.js"]
