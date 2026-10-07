# Multi-stage Dockerfile for Spring Boot 4 Application
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy maven wrapper & pom.xml first for efficient layer caching
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build production jar (skipping unit tests)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# Production Stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/*.jar app.jar

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]