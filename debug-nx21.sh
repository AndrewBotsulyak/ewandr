#!/bin/bash

echo "=== Диагностика NX 21+ Workspace ==="

# Проверка версии NX
echo "Версия NX:"
nx --version

echo ""

# Проверка проектов
echo "Доступные проекты:"
nx show projects

echo ""

# Информация о конкретном проекте
echo "Информация о be-core-service:"
nx show project be-core-service --json | head -20

echo ""

# Проверка целей (targets)
echo "Доступные цели для be-core-service:"
nx show project be-core-service | grep -A 20 "targets"

echo ""

# Проверка кэша
echo "Информация о кэше NX:"
nx show cache

echo ""

# Проверка плагинов
echo "Активные плагины:"
grep -A 10 '"plugins"' nx.json

echo ""

# Проверка структуры проекта
echo "Структура be-core-service:"
ls -la apps/backends/be-core-service/

echo ""

# Проверка package.json проекта
if [ -f "apps/backends/be-core-service/package.json" ]; then
    echo "package.json проекта:"
    cat apps/backends/be-core-service/package.json
else
    echo "package.json проекта не найден (это нормально для NX 21+)"
fi

echo ""

# Проверка project.json
if [ -f "apps/backends/be-core-service/project.json" ]; then
    echo "project.json найден:"
    cat apps/backends/be-core-service/project.json
else
    echo "project.json не найден (конфигурация через плагины)"
fi

echo ""

# Тест сборки
echo "Тест сборки (dry-run):"
nx build be-core-service --dry-run

echo ""
echo "=== Конец диагностики ==="
