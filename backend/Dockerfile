#
#   CampiMove Dockerfile to create the Spring Boot project image
#                   Dockerfile by Bruno Frade
#

# Etapa 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM openjdk:21
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]