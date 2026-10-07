# System Architecture

## 1. System Overview

The Event Booking Platform is a comprehensive REST API system for managing event ticketing with multi-role access control. The system supports:

- **Public Users**: Browse and purchase tickets without registration (guest checkout)
- **Registered Users**: Full account features with purchase history and statistics
- **Creators**: Verified users who can create and manage events (subject to admin approval)
- **Admins**: Full system control including user management, event publishing, and commission settings

### Key Features
- Role-based authentication and authorization (JWT)
- Guest ticket purchasing with unique codes and QR codes
- Event creation workflow with admin approval
- Payment processing integration
- Email notifications (AWS SES)
- Commission management per event
- Comprehensive admin dashboard capabilities

---

## 2. Technology Stack

### Backend Framework
- **Spring Boot 4.0.1** - Application framework
- **Java 17** - Programming language
- **Maven** - Dependency management

### Database
- **PostgreSQL** - Primary relational database
- **Flyway** - Database migration tool

### Security
- **Spring Security** - Security framework
- **JWT (JSON Web Tokens)** - Authentication mechanism
- **BCrypt** - Password hashing

### API Documentation
- **SpringDoc OpenAPI 3** - API documentation (Swagger UI)

### Email Service
- **Spring Mail** - Email abstraction
- **AWS SES (Simple Email Service)** - Email delivery

### Payment Processing
- **Stripe SDK** - Payment gateway integration (or similar provider)

### QR Code Generation
- **ZXing** - QR code library

### Testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **TestContainers** - Integration testing with real PostgreSQL
- **Spring Boot Test** - Integration test support
- **REST Assured** - API endpoint testing

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development environment
- **GitHub Actions** - CI/CD pipelines
- **AWS ECS/Fargate** - Container orchestration
- **AWS RDS** - Managed PostgreSQL database
- **AWS Secrets Manager** - Secure credential storage
- **AWS ECR** - Docker container registry
- **AWS CloudWatch** - Logging and monitoring

### Build & Code Quality
- **Maven Surefire** - Test execution
- **Maven Failsafe** - Integration test execution
- **JaCoCo** - Code coverage reporting
- **SpotBugs/PMD** - Static code analysis (optional)

---

## 3. Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    REST API Controllers                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │  Public  │  │   User   │  │  Admin   │   │
│  │Controller│  │Controller│  │Controller│  │Controller│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│  ┌────▼─────────────▼──────────────▼─────────────▼────┐   │
│  │           Exception Handler (Global)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Security Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ JWT Filter   │  │ Security     │  │ UserDetails  │     │
│  │              │  │ Config       │  │ Service      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Service Layer (Business Logic)           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Auth   │  │  Event   │  │  Ticket  │  │ Payment  │     │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   User   │  │  Email   │  │   QR     │  │Commission│     │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Repository Layer (Data Access)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │  Event   │  │  Ticket  │  │ Payment  │   │
│  │Repository│  │Repository│  │Repository│  │Repository│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Database Layer (PostgreSQL)               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tables: users, events, tickets, payments, etc.     │   │
│  │  Indexes, Constraints, Relationships                │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

Supporting Layers:
┌──────────────────────────────────────────────────────────────┐
│  DTO Layer          │  Request/Response Data Transfer Objects│
│  Config Layer       │  Security, Email, Payment, Swagger    │
│  Exception Layer    │  Custom Exceptions & Global Handler   │
│  Util Layer         │  Helpers, Constants, Validators       │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Security Architecture

### Authentication Flow

```
1. User Login Request
   ↓
2. AuthController receives credentials
   ↓
3. AuthService validates credentials
   ↓
4. JWT Token generated (includes user ID, email, roles)
   ↓
5. Token returned to client
   ↓
6. Client stores token (localStorage/sessionStorage)
   ↓
7. Subsequent requests include: Authorization: Bearer <token>
   ↓
8. JWT Filter intercepts request
   ↓
9. Token validated and user context extracted
   ↓
10. Request proceeds to controller
```

### Authorization Matrix

| Endpoint Pattern | Required Role | Public Access |
|-----------------|---------------|---------------|
| `/api/public/**` | None | ✅ Yes |
| `/api/auth/**` | None (login/register) | ✅ Yes |
| `/api/users/**` | USER | ❌ No |
| `/api/creators/**` | CREATOR | ❌ No |
| `/api/admin/**` | ADMIN | ❌ No |

### Password Security
- Passwords hashed using BCrypt (strength: 10 rounds)
- Password policy: Minimum 8 characters, must include uppercase, lowercase, number, special character
- Passwords never stored in plain text
- JWT tokens expire after 24 hours (configurable)

### Data Protection
- All API endpoints use HTTPS in production
- Sensitive data (passwords, payment info) encrypted at rest
- SQL injection prevention via JPA parameterized queries
- XSS protection via input validation and sanitization

---

## 5. CI/CD Pipeline Architecture

### GitHub Actions Workflow Stages

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline Flow                       │
└─────────────────────────────────────────────────────────────┘

1. TRIGGER: Push to main/develop or Pull Request
   ↓
2. CHECKOUT CODE
   ↓
3. SET UP JAVA 17
   ↓
4. CACHE MAVEN DEPENDENCIES
   ↓
5. CODE QUALITY CHECKS
   ├─ SpotBugs/PMD (Static Analysis)
   └─ Code formatting check
   ↓
6. BUILD APPLICATION
   ├─ mvn clean compile
   └─ Resolve dependencies
   ↓
7. RUN UNIT TESTS
   ├─ mvn test
   ├─ Generate JaCoCo coverage report
   └─ Coverage threshold: 80% minimum
   ↓
8. RUN INTEGRATION TESTS
   ├─ mvn verify (TestContainers)
   ├─ Spin up PostgreSQL container
   └─ Execute integration tests
   ↓
9. BUILD DOCKER IMAGE
   ├─ Tag with commit SHA
   └─ Tag with branch name (if main)
   ↓
10. SECURITY SCANNING
    ├─ Docker image vulnerability scan
    └─ Dependency vulnerability check
    ↓
11. PUSH TO AWS ECR
    └─ Store Docker image
    ↓
12. DEPLOYMENT (Only on main branch)
    ├─ DEV Environment (Automatic)
    │  └─ Deploy to ECS Fargate (DEV)
    ├─ STAGING Environment (Manual approval)
    │  └─ Deploy to ECS Fargate (STAGING)
    └─ PROD Environment (Manual approval)
       └─ Deploy to ECS Fargate (PROD)
    ↓
13. HEALTH CHECK
    └─ Verify application is running
    ↓
14. SMOKE TESTS
    └─ Execute critical path API tests
    ↓
15. NOTIFICATIONS
    └─ Send Slack/Email on success/failure
```

### Pipeline Jobs

#### Job 1: Build & Test
- **Triggers**: Every push, PR
- **Steps**:
  - Checkout code
  - Setup Java 17
  - Cache Maven dependencies
  - Run `mvn clean test` (unit tests)
  - Generate coverage report
  - Upload coverage to codecov.io (optional)
  - Fail if coverage < 80%

#### Job 2: Integration Tests
- **Triggers**: After successful build
- **Steps**:
  - Start PostgreSQL container (TestContainers)
  - Run Flyway migrations
  - Execute integration tests
  - Stop container

#### Job 3: Build & Push Docker Image
- **Triggers**: After successful tests
- **Steps**:
  - Build Docker image
  - Scan for vulnerabilities
  - Tag image with SHA and branch
  - Push to AWS ECR
  - Store image URI in workflow artifact

#### Job 4: Deploy to DEV
- **Triggers**: Push to `develop` branch, after image push
- **Steps**:
  - Configure AWS credentials
  - Update ECS service with new image
  - Wait for deployment to complete
  - Run health check
  - Execute smoke tests

#### Job 5: Deploy to STAGING
- **Triggers**: Manual approval, after DEV deployment
- **Steps**:
  - Same as DEV deployment
  - Use STAGING environment variables

#### Job 6: Deploy to PROD
- **Triggers**: Manual approval, after STAGING deployment
- **Steps**:
  - Same as DEV/STAGING
  - Use PROD environment variables
  - Blue-green deployment strategy (optional)

### Testing Strategy in CI/CD

1. **Unit Tests** (Fast, isolated)
   - Service layer logic
   - Utility functions
   - DTO validation
   - Target: 80%+ coverage

2. **Integration Tests** (Medium speed, real DB)
   - Repository layer with TestContainers
   - Service layer with in-memory DB
   - API endpoints with MockMvc

3. **E2E Tests** (Slow, full stack)
   - Critical user flows
   - Payment processing
   - Email sending (mocked)

4. **Smoke Tests** (Post-deployment)
   - Health check endpoint
   - Login endpoint
   - Public events endpoint

---

## 6. AWS Infrastructure Architecture

### Production Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Application Load Balancer (ALB)          │  │
│  │              - SSL Termination (HTTPS)                │  │
│  │              - Health Checks                          │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              ECS Fargate Cluster                      │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   Service    │  │   Service    │                 │  │
│  │  │  (Task 1)    │  │  (Task 2)    │                 │  │
│  │  │  Spring Boot │  │  Spring Boot │                 │  │
│  │  │  Container   │  │  Container   │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  │  - Auto-scaling (min: 2, max: 10)                   │  │
│  │  - Health checks                                     │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              RDS PostgreSQL                          │  │
│  │  - Multi-AZ deployment                               │  │
│  │  - Automated backups                                 │  │
│  │  - Connection pooling (HikariCP)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              AWS Services                            │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │      SES     │  │   Secrets    │                 │  │
│  │  │   (Email)    │  │   Manager    │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │ CloudWatch   │  │      ECR     │                 │  │
│  │  │  (Logs)      │  │  (Registry)  │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### AWS Services Used

#### Compute
- **ECS Fargate**: Container orchestration (serverless)
- **ECR**: Docker image storage

#### Database
- **RDS PostgreSQL**: Managed database service
  - Multi-AZ for high availability
  - Automated backups (daily)
  - Point-in-time recovery

#### Networking
- **Application Load Balancer (ALB)**: Route traffic to ECS tasks
- **VPC**: Isolated network environment
- **Security Groups**: Firewall rules

#### Storage & Secrets
- **AWS Secrets Manager**: Store database passwords, JWT secrets, API keys
- **S3** (optional): Store event images, QR codes, receipts

#### Monitoring & Logging
- **CloudWatch Logs**: Application logs
- **CloudWatch Metrics**: CPU, memory, request metrics
- **CloudWatch Alarms**: Alert on errors, high latency

#### Email
- **AWS SES**: Send transactional emails
  - Email templates for notifications
  - Bounce/complaint handling

### Environment Configuration

#### Development (Local)
- Docker Compose: PostgreSQL container
- Spring Boot runs on localhost:8080
- Application profile: `dev`

#### DEV (AWS)
- ECS Fargate: 1 task (single instance)
- RDS: db.t3.micro (small instance)
- Auto-scaling: Disabled

#### STAGING (AWS)
- ECS Fargate: 2 tasks (high availability)
- RDS: db.t3.small
- Auto-scaling: Enabled (min: 2, max: 5)

#### PRODUCTION (AWS)
- ECS Fargate: 3+ tasks (high availability)
- RDS: db.t3.medium or larger
- Auto-scaling: Enabled (min: 3, max: 10)
- Multi-AZ RDS deployment
- CloudFront CDN (optional, for static assets)

---

## 7. Deployment Process

### Pre-Deployment Checklist
1. ✅ All tests passing (unit, integration, E2E)
2. ✅ Code coverage ≥ 80%
3. ✅ Security scans passed
4. ✅ Database migrations tested
5. ✅ Environment variables configured
6. ✅ Secrets stored in AWS Secrets Manager

### Deployment Steps

1. **Code Merge**: Merge feature branch to `develop` or `main`
2. **CI Pipeline Triggered**: Automatic build and test
3. **Docker Image Created**: Tagged with commit SHA
4. **Image Pushed to ECR**: Stored in AWS container registry
5. **ECS Service Updated**: New task definition with new image
6. **Rolling Deployment**:
   - New tasks start up
   - Health checks pass
   - Old tasks drained (stop accepting new connections)
   - Old tasks terminated
7. **Verification**: Smoke tests confirm deployment success

### Rollback Strategy

If deployment fails:
1. Revert to previous task definition in ECS
2. Update service to use previous image
3. Investigate failure in logs (CloudWatch)
4. Fix issue and redeploy

---

## 8. Monitoring & Observability

### Application Metrics
- Request count by endpoint
- Response time percentiles (p50, p95, p99)
- Error rate (4xx, 5xx)
- Active user sessions
- Database connection pool usage

### Infrastructure Metrics
- ECS task CPU/memory utilization
- RDS CPU/memory/connections
- ALB request count and latency

### Logging Strategy
- **Application Logs**: Structured JSON logs to CloudWatch
- **Access Logs**: ALB access logs to S3
- **Error Tracking**: Stack traces with context

### Alerts
- High error rate (> 5% of requests)
- High latency (p95 > 2 seconds)
- Database connection pool exhaustion
- ECS task failures
- RDS CPU/memory high usage

---

## 9. Security Best Practices

1. **Secrets Management**: All sensitive data in AWS Secrets Manager
2. **Network Security**: VPC with private subnets for ECS/RDS
3. **Encryption**: Data encrypted at rest (RDS) and in transit (HTTPS)
4. **IAM Roles**: Least privilege principle for AWS resources
5. **Regular Updates**: Dependencies and base images updated regularly
6. **Vulnerability Scanning**: Automated scanning in CI/CD
7. **Rate Limiting**: API rate limiting to prevent abuse
8. **Input Validation**: All user inputs validated and sanitized

---

## 10. Scalability Considerations

### Horizontal Scaling
- ECS Fargate auto-scales based on CPU/memory
- ALB distributes load across tasks
- Stateless application design (no session storage in app)

### Database Scaling
- Connection pooling (HikariCP) to manage DB connections
- Read replicas (optional) for read-heavy workloads
- Index optimization for frequently queried columns

### Caching (Future Enhancement)
- Redis for session storage (if needed)
- Event listings cached (5-10 minutes TTL)
- Frequently accessed data cached

---

## 11. Disaster Recovery

### Backup Strategy
- **Database**: Daily automated backups, 7-day retention
- **Application**: Docker images in ECR (versioned)
- **Configuration**: Infrastructure as Code (CloudFormation/Terraform)

### Recovery Procedures
1. **Database Failure**: Restore from RDS snapshot
2. **Application Failure**: Rollback to previous ECS task definition
3. **Region Failure**: Multi-region deployment (future)

---

This architecture ensures a production-ready, scalable, and maintainable event booking system with comprehensive CI/CD, testing, and AWS infrastructure.
