# Etapa 1: build site static (Astro)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# npm install (nu npm ci): lockfile-ul generat pe Windows omite dependențe
# opționale wasm32 pe care npm ci le cere pe Linux (bug cunoscut npm)
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# Etapa 2: servire cu nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/ || exit 1
