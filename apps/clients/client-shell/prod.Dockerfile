FROM node:20-alpine

# Установка dumb-init для правильной обработки сигналов
RUN apk add --no-cache dumb-init

WORKDIR /app

# Копируем скомпилированный код
# Пути относительно места запуска docker build
COPY ./dist/apps/clients/client-shell/browser ./dist/apps/clients/client-shell/browser
COPY ./dist/apps/clients/client-shell/server ./dist/apps/clients/client-shell/server

# Если в server есть node_modules или package.json
# COPY ./dist/apps/clients/client-shell/server/node_modules ./server/node_modules

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4200

# Используем dumb-init для правильной обработки процессов
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/apps/clients/client-shell/server/main.js"]
