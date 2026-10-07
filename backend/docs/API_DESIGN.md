# API Design Documentation

## 1. API Overview

### Base URLs
- **Development**: `http://localhost:8080/api`
- **Production**: `https://api.yourdomain.com/api`

### API Versioning
- Current version: v1 (implied, no version prefix)
- Future versions: `/api/v2/...` (when needed)

### Authentication
Most endpoints require JWT authentication:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

Public endpoints don't require authentication (marked with 🔓).

---

## 2. Common Response Formats

### Success Response
```json
{
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Pagination Response
```json
{
  "content": [ ... ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0,
  "pageSize": 10,
  "first": true,
  "last": false
}
```

### HTTP Status Codes
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST (resource created)
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation error, invalid input
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `500 Internal Server Error`: Server error

---

## 3. Authentication Endpoints

### POST /api/auth/register 🔓

**Description**: Register a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Validation**:
- Email: Valid email format, unique
- Password: Min 8 chars, uppercase, lowercase, number, special char
- FirstName/LastName: Required, max 100 chars
- PhoneNumber: Optional, valid format

**Response**: `201 Created`
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "Registration successful. Please verify your email."
}
```

**Errors**:
- `409 Conflict`: Email already exists
- `400 Bad Request`: Validation errors

---

### POST /api/auth/login 🔓

**Description**: Login and get JWT token

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**: `200 OK`
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["USER"]
    }
  }
}
```

**Errors**:
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account suspended

---

### POST /api/auth/refresh-token

**Description**: Refresh JWT token (before expiration)

**Headers**: `Authorization: Bearer <current_token>`

**Response**: `200 OK`
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "expiresIn": 86400
  }
}
```

---

### POST /api/auth/request-creator-verification

**Description**: User requests to become a creator (sends OTP email)

**Required Role**: USER

**Headers**: `Authorization: Bearer <token>`

**Response**: `200 OK`
```json
{
  "message": "OTP sent to your email. Please verify within 10 minutes."
}
```

**Errors**:
- `409 Conflict`: Already a creator or pending verification
- `400 Bad Request`: Email not verified

---

### POST /api/auth/verify-creator-otp

**Description**: Verify OTP to become a creator

**Required Role**: USER

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "otp": "123456"
}
```

**Response**: `200 OK`
```json
{
  "message": "Creator account verified successfully.",
  "data": {
    "creatorStatus": "VERIFIED",
    "roles": ["USER", "CREATOR"]
  }
}
```

**Errors**:
- `400 Bad Request`: Invalid or expired OTP
- `404 Not Found`: No pending OTP request

---

## 4. Public Endpoints 🔓

### GET /api/public/events

**Description**: Get all published events (paginated)

**Query Parameters**:
- `page` (default: 0): Page number
- `size` (default: 20): Page size
- `category` (optional): Filter by category
- `search` (optional): Search in title/description
- `sort` (default: eventDate,asc): Sort field and direction

**Response**: `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "title": "Summer Music Festival",
      "description": "Amazing music event...",
      "eventDate": "2024-07-15T18:00:00Z",
      "eventEndDate": "2024-07-15T23:00:00Z",
      "venueName": "Central Park",
      "venueAddress": "123 Main St, City",
      "imageUrl": "https://...",
      "category": "Concert",
      "creator": {
        "id": 5,
        "name": "Event Organizer Co."
      },
      "ticketTypes": [
        {
          "id": 1,
          "name": "VIP",
          "price": 150.00,
          "quantityAvailable": 50,
          "isActive": true
        },
        {
          "id": 2,
          "name": "General Admission",
          "price": 75.00,
          "quantityAvailable": 200,
          "isActive": true
        }
      ],
      "ticketsSold": 25,
      "totalTicketsAvailable": 250
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 0,
  "pageSize": 20,
  "first": true,
  "last": false
}
```

---

### GET /api/public/events/{eventId}

**Description**: Get event details by ID

**Response**: `200 OK`
```json
{
  "id": 1,
  "title": "Summer Music Festival",
  "description": "Full description...",
  "eventDate": "2024-07-15T18:00:00Z",
  "eventEndDate": "2024-07-15T23:00:00Z",
  "venueName": "Central Park",
  "venueAddress": "123 Main St, City",
  "imageUrl": "https://...",
  "category": "Concert",
  "status": "PUBLISHED",
  "creator": {
    "id": 5,
    "email": "creator@example.com",
    "name": "Event Organizer Co."
  },
  "ticketTypes": [ ... ],
  "ticketsSold": 25,
  "totalTicketsAvailable": 250
}
```

**Errors**:
- `404 Not Found`: Event not found or not published

---

### POST /api/public/purchase/guest 🔓

**Description**: Purchase tickets as guest (no signup required)

**Request Body**:
```json
{
  "eventId": 1,
  "eventTicketTypeId": 1,
  "quantity": 2,
  "buyerEmail": "guest@example.com",
  "buyerPhone": "+1234567890",
  "paymentMethod": "credit_card",
  "paymentToken": "stripe_token_here"
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "purchaseCode": "EVT-A1B2C3XYZ",
    "qrCodeData": "data:image/png;base64,iVBORw0KGgo...",
    "totalAmount": 300.00,
    "quantity": 2,
    "purchaseStatus": "COMPLETED",
    "event": {
      "id": 1,
      "title": "Summer Music Festival",
      "eventDate": "2024-07-15T18:00:00Z"
    },
    "ticketType": {
      "name": "VIP",
      "price": 150.00
    }
  },
  "message": "Purchase successful. Use the code to access your tickets."
}
```

**Errors**:
- `400 Bad Request`: Invalid quantity, insufficient tickets, validation errors
- `404 Not Found`: Event or ticket type not found
- `402 Payment Required`: Payment failed

---

### GET /api/public/purchase/{purchaseCode} 🔓

**Description**: Get purchase details by code (for guests)

**Response**: `200 OK`
```json
{
  "purchaseCode": "EVT-A1B2C3XYZ",
  "event": {
    "id": 1,
    "title": "Summer Music Festival",
    "eventDate": "2024-07-15T18:00:00Z",
    "venueName": "Central Park"
  },
  "ticketType": {
    "name": "VIP",
    "price": 150.00
  },
  "quantity": 2,
  "totalAmount": 300.00,
  "buyerEmail": "guest@example.com",
  "purchaseDate": "2024-01-15T10:30:00Z",
  "purchaseStatus": "COMPLETED",
  "qrCodeData": "data:image/png;base64,..."
}
```

**Errors**:
- `404 Not Found`: Purchase code not found

---

### GET /api/public/purchase/{purchaseCode}/receipt 🔓

**Description**: Download receipt PDF

**Response**: `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="receipt-EVT-A1B2C3XYZ.pdf"`

**Errors**:
- `404 Not Found`: Purchase code not found

---

## 5. User Endpoints

### GET /api/users/profile

**Description**: Get current user's profile

**Required Role**: USER

**Response**: `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "emailVerified": true,
  "accountStatus": "ACTIVE",
  "creatorStatus": null,
  "roles": ["USER"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### PUT /api/users/profile

**Description**: Update user profile

**Required Role**: USER

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}
```

**Response**: `200 OK`
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    ...
  }
}
```

---

### GET /api/users/purchases

**Description**: Get user's purchase history

**Required Role**: USER

**Query Parameters**:
- `page` (default: 0)
- `size` (default: 20)
- `status` (optional): Filter by purchase status

**Response**: `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "purchaseCode": "EVT-ABC123",
      "event": {
        "id": 1,
        "title": "Summer Music Festival",
        "eventDate": "2024-07-15T18:00:00Z",
        "imageUrl": "https://..."
      },
      "ticketType": {
        "name": "VIP",
        "price": 150.00
      },
      "quantity": 2,
      "totalAmount": 300.00,
      "purchaseDate": "2024-01-15T10:30:00Z",
      "purchaseStatus": "COMPLETED",
      "qrCodeData": "data:image/png;base64,..."
    }
  ],
  "totalElements": 10,
  "totalPages": 1
}
```

---

### POST /api/users/purchase

**Description**: Purchase tickets (registered user)

**Required Role**: USER

**Request Body**:
```json
{
  "eventId": 1,
  "eventTicketTypeId": 1,
  "quantity": 2,
  "paymentMethod": "credit_card",
  "paymentToken": "stripe_token_here"
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "purchaseCode": "EVT-ABC123",
    "totalAmount": 300.00,
    "quantity": 2,
    "purchaseStatus": "COMPLETED",
    "qrCodeData": "data:image/png;base64,..."
  },
  "message": "Purchase successful"
}
```

---

### GET /api/users/stats

**Description**: Get user statistics

**Required Role**: USER

**Response**: `200 OK`
```json
{
  "totalPurchases": 10,
  "totalSpent": 1500.00,
  "upcomingEvents": 2,
  "pastEvents": 8,
  "favoriteCategories": ["Concert", "Conference"]
}
```

---

## 6. Creator Endpoints

### GET /api/creators/events

**Description**: Get creator's events

**Required Role**: CREATOR

**Query Parameters**:
- `page` (default: 0)
- `size` (default: 20)
- `status` (optional): Filter by status (DRAFT, PENDING_APPROVAL, PUBLISHED, CANCELLED)

**Response**: `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "title": "My Event",
      "status": "PENDING_APPROVAL",
      "ticketsSold": 50,
      "totalTicketsAvailable": 200,
      "eventDate": "2024-07-15T18:00:00Z",
      "createdAt": "2024-01-10T00:00:00Z",
      "publishedAt": null
    }
  ],
  "totalElements": 5
}
```

---

### POST /api/creators/events

**Description**: Create a new event

**Required Role**: CREATOR

**Request Body**:
```json
{
  "title": "Summer Music Festival",
  "description": "Amazing music event",
  "venueName": "Central Park",
  "venueAddress": "123 Main St, City",
  "eventDate": "2024-07-15T18:00:00Z",
  "eventEndDate": "2024-07-15T23:00:00Z",
  "category": "Concert",
  "imageUrl": "https://example.com/image.jpg",
  "ticketTypes": [
    {
      "ticketTypeId": 1,
      "price": 150.00,
      "quantityAvailable": 100
    },
    {
      "ticketTypeId": 2,
      "price": 75.00,
      "quantityAvailable": 200
    }
  ]
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "id": 1,
    "title": "Summer Music Festival",
    "status": "DRAFT",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Event created. Please submit for approval when ready."
}
```

---

### GET /api/creators/events/{eventId}

**Description**: Get event details (creator's own event)

**Required Role**: CREATOR (must own the event)

**Response**: `200 OK` (same structure as public event, plus internal fields)

---

### PUT /api/creators/events/{eventId}

**Description**: Update event (only if status is DRAFT)

**Required Role**: CREATOR (must own the event)

**Request Body**: Same as POST /api/creators/events

**Response**: `200 OK`

**Errors**:
- `400 Bad Request`: Event is not in DRAFT status
- `403 Forbidden`: Not the event creator

---

### POST /api/creators/events/{eventId}/submit

**Description**: Submit event for admin approval

**Required Role**: CREATOR (must own the event)

**Response**: `200 OK`
```json
{
  "message": "Event submitted for approval.",
  "data": {
    "id": 1,
    "status": "PENDING_APPROVAL"
  }
}
```

**Errors**:
- `400 Bad Request`: Event is not in DRAFT status or missing required fields

---

### GET /api/creators/events/{eventId}/purchases

**Description**: View purchases for an event

**Required Role**: CREATOR (must own the event)

**Query Parameters**: `page`, `size`

**Response**: `200 OK`
```json
{
  "content": [
    {
      "purchaseCode": "EVT-ABC123",
      "buyerEmail": "buyer@example.com",
      "buyerPhone": "+1234567890",
      "ticketType": {
        "name": "VIP",
        "price": 150.00
      },
      "quantity": 2,
      "totalAmount": 300.00,
      "purchaseDate": "2024-01-15T10:30:00Z",
      "purchaseStatus": "COMPLETED"
    }
  ],
  "totalElements": 50
}
```

---

### GET /api/creators/stats

**Description**: Get creator statistics

**Required Role**: CREATOR

**Response**: `200 OK`
```json
{
  "totalEvents": 5,
  "publishedEvents": 3,
  "pendingEvents": 2,
  "draftEvents": 0,
  "totalTicketsSold": 500,
  "totalRevenue": 50000.00,
  "upcomingEvents": 2,
  "pastEvents": 1
}
```

---

## 7. Admin Endpoints

### GET /api/admin/users

**Description**: Get all users (paginated, filterable)

**Required Role**: ADMIN

**Query Parameters**:
- `page` (default: 0)
- `size` (default: 20)
- `role` (optional): Filter by role (ADMIN, USER, CREATOR)
- `status` (optional): Filter by account status
- `search` (optional): Search in email, name

**Response**: `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["USER"],
      "accountStatus": "ACTIVE",
      "creatorStatus": null,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T08:00:00Z"
    }
  ],
  "totalElements": 100
}
```

---

### PUT /api/admin/users/{userId}/suspend

**Description**: Suspend a user account

**Required Role**: ADMIN

**Request Body**:
```json
{
  "reason": "Violation of terms of service"
}
```

**Response**: `200 OK`
```json
{
  "message": "User suspended successfully.",
  "data": {
    "id": 1,
    "accountStatus": "SUSPENDED"
  }
}
```

---

### PUT /api/admin/users/{userId}/activate

**Description**: Activate a suspended user

**Required Role**: ADMIN

**Response**: `200 OK`
```json
{
  "message": "User activated successfully.",
  "data": {
    "id": 1,
    "accountStatus": "ACTIVE"
  }
}
```

---

### GET /api/admin/creators/pending

**Description**: Get pending creator verification requests

**Required Role**: ADMIN

**Response**: `200 OK`
```json
{
  "content": [
    {
      "id": 5,
      "email": "creator@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "phoneNumber": "+1234567890",
      "requestDate": "2024-01-15T10:00:00Z",
      "creatorStatus": "PENDING_VERIFICATION"
    }
  ],
  "totalElements": 10
}
```

---

### PUT /api/admin/creators/{userId}/verify

**Description**: Verify a creator account

**Required Role**: ADMIN

**Response**: `200 OK`
```json
{
  "message": "Creator verified successfully.",
  "data": {
    "userId": 5,
    "creatorStatus": "VERIFIED"
  }
}
```

---

### PUT /api/admin/creators/{userId}/reject

**Description**: Reject creator verification

**Required Role**: ADMIN

**Request Body**:
```json
{
  "reason": "Incomplete information or does not meet requirements"
}
```

**Response**: `200 OK`
```json
{
  "message": "Creator verification rejected.",
  "data": {
    "userId": 5,
    "creatorStatus": "REJECTED"
  }
}
```

---

### GET /api/admin/events/pending

**Description**: Get events pending approval

**Required Role**: ADMIN

**Query Parameters**: `page`, `size`

**Response**: `200 OK` (similar to GET /api/creators/events but all pending events)

---

### GET /api/admin/events/{eventId}

**Description**: Get event details (admin view)

**Required Role**: ADMIN

**Response**: `200 OK` (full event details with all fields)

---

### PUT /api/admin/events/{eventId}/publish

**Description**: Publish an event

**Required Role**: ADMIN

**Request Body**:
```json
{
  "commissionType": "PERCENTAGE",
  "commissionValue": 10.0,
  "notes": "Approved for publication"
}
```

**Response**: `200 OK`
```json
{
  "message": "Event published successfully.",
  "data": {
    "eventId": 1,
    "status": "PUBLISHED",
    "publishedAt": "2024-01-15T10:30:00Z",
    "commission": {
      "type": "PERCENTAGE",
      "value": 10.0
    }
  }
}
```

**Note**: This triggers an email to the creator notifying them the event is published.

---

### PUT /api/admin/events/{eventId}/reject

**Description**: Reject an event

**Required Role**: ADMIN

**Request Body**:
```json
{
  "reason": "Inappropriate content or does not meet guidelines"
}
```

**Response**: `200 OK`
```json
{
  "message": "Event rejected.",
  "data": {
    "eventId": 1,
    "status": "CANCELLED"
  }
}
```

---

### POST /api/admin/ticket-types

**Description**: Create a new ticket type

**Required Role**: ADMIN

**Request Body**:
```json
{
  "name": "VIP",
  "description": "VIP Access with premium benefits",
  "defaultPrice": 150.00
}
```

**Response**: `201 Created`
```json
{
  "data": {
    "id": 1,
    "name": "VIP",
    "description": "VIP Access with premium benefits",
    "defaultPrice": 150.00,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Ticket type created successfully"
}
```

---

### GET /api/admin/ticket-types

**Description**: Get all ticket types

**Required Role**: ADMIN

**Response**: `200 OK`
```json
{
  "content": [
    {
      "id": 1,
      "name": "VIP",
      "description": "VIP Access",
      "defaultPrice": 150.00,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalElements": 5
}
```

---

### PUT /api/admin/ticket-types/{ticketTypeId}

**Description**: Update ticket type

**Required Role**: ADMIN

**Request Body**: Same as POST

**Response**: `200 OK`

---

### DELETE /api/admin/ticket-types/{ticketTypeId}

**Description**: Deactivate ticket type (soft delete)

**Required Role**: ADMIN

**Response**: `200 OK`

**Note**: Cannot delete if used in active events.

---

### GET /api/admin/events/{eventId}/purchases

**Description**: View all purchases for an event

**Required Role**: ADMIN

**Query Parameters**: `page`, `size`

**Response**: `200 OK` (same as creator's purchase view)

---

### GET /api/admin/reports/revenue

**Description**: Get revenue reports

**Required Role**: ADMIN

**Query Parameters**:
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `eventId` (optional): Filter by event

**Response**: `200 OK`
```json
{
  "totalRevenue": 100000.00,
  "totalCommission": 10000.00,
  "totalPurchases": 500,
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "events": [
    {
      "eventId": 1,
      "eventTitle": "Summer Festival",
      "revenue": 25000.00,
      "commission": 2500.00,
      "ticketsSold": 150,
      "purchases": 150
    }
  ]
}
```

---

### GET /api/admin/dashboard/stats

**Description**: Get admin dashboard statistics

**Required Role**: ADMIN

**Response**: `200 OK`
```json
{
  "totalUsers": 1000,
  "totalCreators": 50,
  "totalEvents": 200,
  "publishedEvents": 150,
  "pendingEvents": 20,
  "totalTicketsSold": 10000,
  "totalRevenue": 500000.00,
  "totalCommission": 50000.00,
  "pendingCreatorVerifications": 5
}
```

---

## 8. Webhook Endpoints (Payment Gateway)

### POST /api/webhooks/payment 🔓

**Description**: Receive payment gateway webhooks (Stripe, etc.)

**Authentication**: Webhook signature verification (not JWT)

**Request Body**: Payment gateway webhook payload

**Response**: `200 OK`

**Note**: This endpoint validates webhook signatures and processes payment status updates.

---

## 9. Health Check Endpoint

### GET /api/health 🔓

**Description**: Application health check

**Response**: `200 OK`
```json
{
  "status": "UP",
  "database": "UP",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 10. API Rate Limiting

- **Public endpoints**: 100 requests/minute per IP
- **Authenticated endpoints**: 1000 requests/minute per user
- **Admin endpoints**: 2000 requests/minute per admin

Rate limit headers in response:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1642234560
```

---

## 11. API Documentation

Interactive API documentation available at:
- Swagger UI: `/swagger-ui.html`
- OpenAPI JSON: `/v3/api-docs`

---

This API design provides comprehensive endpoints for all system functionality with proper authentication, authorization, and error handling.

