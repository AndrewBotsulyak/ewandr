# Makefile
.PHONY: help start start-multi stop restart logs shell cleanup build

COMPOSE := docker-compose.local.yml
COMPOSE_PROD := docker-compose.prod.yml

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

# Production section
build-client-shell:
	nx run client-shell:build:production --excludeTaskDependencies && \
	nx run client-shell:server:production --excludeTaskDependencies

build-docker-client-shell-latest:
	docker build -f apps/clients/client-shell/prod.Dockerfile -t client-shell:latest .

client-shell-latest_docker-run:
	docker run -p 4200:4200 client-shell:latest

build-image-be-core-service:
	docker build -f apps/backends/be-core-service/prod.Dockerfile -t be-core-service:latest .
