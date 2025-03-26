FROM openjdk:23-jdk-slim

WORKDIR /app

COPY target/sneaky-store-0.0.1-SNAPSHOT.jar /app/sneaky-store.jar

CMD ["java", "-jar", "/app/sneaky-store.jar"]

EXPOSE 8080
