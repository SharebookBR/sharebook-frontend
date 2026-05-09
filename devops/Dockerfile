# Build Stage
FROM public.ecr.aws/docker/library/node:20-alpine AS build
WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copia código e executa build SSR
COPY . .
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
