FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev --legacy-peer-deps

COPY . .
RUN npm run build:ssr

# ---

FROM node:18-alpine AS runtime

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json /app/node_modules ./node_modules /app/

EXPOSE 4000

ENV PORT=4000

CMD ["node", "dist/angular/server/main.js"]
