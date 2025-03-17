# Используем образ OpenJDK 23
FROM openjdk:23-jdk-slim

# Задаем рабочую директорию (можно использовать /app или любой другой путь)
WORKDIR /app

# Копируем файл JAR в контейнер (убедись, что ты указываешь правильный файл из папки target)
COPY target/*.jar /app/sneaky-store.jar
COPY src/main/resources/application-docker.properties /app/config/

# Открываем порт 8080 для приложения
EXPOSE 8080

# Запускаем Spring Boot приложение
CMD ["java", "-jar", "sneaky-store.jar"]
