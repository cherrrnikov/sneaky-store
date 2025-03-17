# Этап 1: Сборка фронтенда
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Собираем проект для продакшн
RUN npm run build

# Этап 2: Используем Nginx для обслуживания собранных файлов
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа в директорию, которую использует Nginx для статики
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80 для веб-сервера
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
