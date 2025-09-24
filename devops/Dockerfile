# Build
FROM mirror.gcr.io/library/node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm i -g @angular/cli@13.2.5
COPY . .
RUN npm run build-prod -- --output-path=/app/build

# Runtime
FROM mirror.gcr.io/library/nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY devops/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
