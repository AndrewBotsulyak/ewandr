FROM node:20-alpine

WORKDIR /app

COPY dist/apps/backends/be-vendure ./

COPY package*.json ./

RUN npm ci --production --legacy-peer-deps

EXPOSE 3000

CMD ["node", "main.js"]
