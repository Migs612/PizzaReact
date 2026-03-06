FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY index.html vite.config.js ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

COPY backend/ ./

COPY --from=frontend-build /app/dist ./public

EXPOSE 3001

CMD ["node", "server.js"]
