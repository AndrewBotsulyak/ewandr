# Makefile
.PHONY: help start start-multi stop restart logs shell cleanup build

COMPOSE := docker/docker-compose.dev.yml

# Цвета для вывода
YELLOW := \033[33m
GREEN := \033[32m
BLUE := \033[34m
NC := \033[0m

start: ## Запустить be-core-service с hot-reload
	@echo "$(GREEN)Запуск be-core-service...$(NC)"
	docker-compose -f ${COMPOSE} up --build

stop: ## Остановить все сервисы
	@echo "$(YELLOW)Остановка всех сервисов...$(NC)"
	docker-compose -f ${COMPOSE} down

restart: stop start ## Перезапустить be-core-service

build: ## Пересобрать Docker образы
	@echo "$(GREEN)Пересборка образов...$(NC)"
	docker-compose -f ${COMPOSE} build --no-cache

logs: ## Показать логи be-core-service
	docker-compose -f ${COMPOSE} logs -f be-core-service

shell: ## Войти в контейнер be-core-service
	docker-compose -f ${COMPOSE} exec be-core-service sh

cleanup: ## Очистить все Docker ресурсы
	@echo "$(YELLOW)Очистка Docker ресурсов...$(NC)"
	docker-compose -f ${COMPOSE} down -v
	docker system prune -f
	@echo "$(GREEN)Очистка завершена$(NC)"

# Команды для отдельных сервисов (для будущего использования)
start-core: ## Запустить только core service
	docker-compose -f docker-compose.multi-services.yml up be-core-service

# start-auth: ## Запустить только auth service
# 	docker-compose -f docker-compose.multi-services.yml up be-auth-service

# start-user: ## Запустить только user service
# 	docker-compose -f docker-compose.multi-services.yml up be-user-service

# Дополнительные утилиты
ps: ## Показать запущенные контейнеры
	docker-compose -f ${COMPOSE} ps
	docker-compose -f docker-compose.multi-services.yml ps

health: ## Проверить состояние сервисов
	@echo "$(BLUE)Проверка состояния сервисов:$(NC)"
	@curl -f http://localhost:3000/health 2>/dev/null && echo "$(GREEN)✓ be-core-service: OK$(NC)" || echo "$(YELLOW)✗ be-core-service: Not responding$(NC)"

install: ## Установить зависимости в контейнере
	docker-compose -f ${COMPOSE} exec be-core-service npm install
