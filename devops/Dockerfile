# Build
FROM public.ecr.aws/docker/library/node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev --legacy-peer-deps && npm i -g @angular/cli@13.2.5
COPY . .
RUN npm run build:ssr

# Runtime
FROM public.ecr.aws/docker/library/node:20-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 80
ENV PORT=80
CMD ["node", "dist/angular/server/main.js"]
