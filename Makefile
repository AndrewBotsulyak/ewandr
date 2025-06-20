# Makefile
.PHONY: help start start-multi stop restart logs shell cleanup build

COMPOSE := docker-compose.dev.yml

# Цвета для вывода
YELLOW := \033[33m
GREEN := \033[32m
BLUE := \033[34m
NC := \033[0m

start-frontend: ## run dev frontend
	@echo "$(GREEN)Запуск client-shell...$(NC)"
	docker-compose -f ${COMPOSE} up --build client-shell

start-backend: ## run dev backend services
	@echo "$(GREEN)Запуск be-core-service...$(NC)"
	docker-compose -f ${COMPOSE} up --build postgres be-core-service

start-nginx: ## run dev backend services
	@echo "$(GREEN)Запуск nginx...$(NC)"
	docker-compose -f ${COMPOSE} up --build nginx
