FROM node:20-alpine

WORKDIR /app

# Копирование package files для кэширования зависимостей
COPY ../../../package*.json ../../../nx.json ../../../tsconfig.base.json ./

RUN npm ci --legacy-peer-deps

# Открытие порта
EXPOSE 4200 4201

CMD ["npx", "nx", "run", "client-shell:serve-ssr"]
