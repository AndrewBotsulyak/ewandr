# Dockerfile.dev
FROM node:20-alpine

# Установка глобальных зависимостей
#RUN npm install -g nx nodemon

# Создание рабочей директории
WORKDIR /app

# Копирование package files для кэширования зависимостей
COPY ../../../package*.json ../../../nx.json ../../../tsconfig.base.json ./

# Установка зависимостей
# Удаление node_modules если есть и переустановка
#RUN rm -rf node_modules package-lock.json || true
#RUN npm install --legacy-peer-deps
RUN npm ci --legacy-peer-deps --force

## Копирование конфигурационных файлов проектов
#COPY apps/ ./apps/
#COPY ../../../libs ./libs/
#
## Копирование всего проекта
#COPY . .

# Открытие порта
EXPOSE 3000

# Команда для запуска с hot-reload
CMD ["npx", "nx", "run", "be-vendure:serve:development"]
