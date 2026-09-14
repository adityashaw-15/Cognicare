FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src
COPY jarvis-demo.db .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/jarvis-demo.db .

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]