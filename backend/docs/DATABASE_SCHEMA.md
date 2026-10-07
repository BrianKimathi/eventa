# Database Schema Design

## 1. Entity Relationship Overview

### High-Level Relationships

```
USER ←→ ROLE (Many-to-Many via USER_ROLES)
USER → TICKET_PURCHASE (One-to-Many, nullable - guest purchases)
USER → EVENT (Creator - One-to-Many)
EVENT → TICKET_TYPE (Many-to-Many via EVENT_TICKET_TYPES)
EVENT → TICKET_PURCHASE (One-to-Many)
EVENT → COMMISSION (One-to-One, set by Admin)
TICKET_TYPE → TICKET_PURCHASE (One-to-Many via EVENT_TICKET_TYPES)
TICKET_PURCHASE → PAYMENT_TRANSACTION (One-to-One)
```

### Entity Cardinality Summary

| Entity A | Relationship | Entity B | Notes |
|----------|-------------|----------|-------|
| User | 1:N | Event | Creator creates events |
| User | 1:N | TicketPurchase | User can have many purchases (nullable - guests) |
| Event | 1:N | TicketPurchase | Event has many purchases |
| Event | M:N | TicketType | Through EVENT_TICKET_TYPES |
| Event | 1:1 | Commission | Each event has one commission setting |
| TicketPurchase | 1:1 | PaymentTransaction | One purchase = one payment |
| User | M:N | Role | Through USER_ROLES |

---

## 2. Detailed Table Designs

### 2.1 USERS Table

**Purpose**: Stores all user accounts (regular users, creators, admins)

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    creator_status VARCHAR(20),
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login TIMESTAMP,
    
    CONSTRAINT chk_account_status CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
    CONSTRAINT chk_creator_status CHECK (creator_status IS NULL OR creator_status IN ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'))
);

-- Indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_account_status ON users(account_status);
CREATE INDEX idx_user_creator_status ON users(creator_status);
CREATE INDEX idx_user_otp_code ON users(otp_code) WHERE otp_code IS NOT NULL;

-- Comments
COMMENT ON TABLE users IS 'Stores all user accounts in the system';
COMMENT ON COLUMN users.account_status IS 'ACTIVE, SUSPENDED, or DELETED';
COMMENT ON COLUMN users.creator_status IS 'NULL for regular users, PENDING_VERIFICATION/VERIFIED/REJECTED for creators';
COMMENT ON COLUMN users.otp_code IS '6-digit OTP for creator email verification';
```

**Field Descriptions**:
- `id`: Primary key, auto-incrementing
- `email`: Unique email address for login
- `password_hash`: BCrypt hashed password
- `account_status`: User account state (ACTIVE, SUSPENDED, DELETED)
- `creator_status`: NULL for regular users, set when requesting creator status
- `otp_code`: Temporary 6-digit code for creator verification
- `otp_expires_at`: OTP expiration timestamp (typically 10 minutes)

---

### 2.2 ROLES Table

**Purpose**: Defines system roles (ADMIN, USER, CREATOR)

```sql
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Full system access - can manage users, events, and settings'),
('USER', 'Regular user - can purchase tickets and manage profile'),
('CREATOR', 'Verified creator - can create and manage events');

-- Indexes
CREATE INDEX idx_role_name ON roles(name);

COMMENT ON TABLE roles IS 'System roles for role-based access control';
```

**Pre-populated Data**:
- ADMIN: Full system access
- USER: Regular ticket buyer
- CREATOR: Event creator (after verification)

---

### 2.3 USER_ROLES Table (Join Table)

**Purpose**: Many-to-Many relationship between Users and Roles

```sql
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) 
        REFERENCES roles(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

COMMENT ON TABLE user_roles IS 'Links users to their roles (users can have multiple roles)';
```

**Constraints**:
- User can have multiple roles (e.g., USER + CREATOR)
- Cascade delete: if user/role deleted, relationship removed

---

### 2.4 EVENTS Table

**Purpose**: Stores all events created by creators

```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    creator_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT NOT NULL,
    event_date TIMESTAMP NOT NULL,
    event_end_date TIMESTAMP,
    image_url VARCHAR(500),
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL,
    published_at TIMESTAMP,
    published_by BIGINT,
    total_tickets_available INTEGER DEFAULT 0,
    tickets_sold INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_events_creator FOREIGN KEY (creator_id) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_events_published_by FOREIGN KEY (published_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_event_status CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'CANCELLED')),
    CONSTRAINT chk_event_dates CHECK (event_end_date IS NULL OR event_end_date >= event_date),
    CONSTRAINT chk_tickets_sold CHECK (tickets_sold <= total_tickets_available)
);

-- Indexes
CREATE INDEX idx_event_creator ON events(creator_id);
CREATE INDEX idx_event_status ON events(status);
CREATE INDEX idx_event_date ON events(event_date);
CREATE INDEX idx_event_category ON events(category);
CREATE INDEX idx_event_published ON events(status, published_at) WHERE status = 'PUBLISHED';

COMMENT ON TABLE events IS 'Events created by creators, managed through approval workflow';
COMMENT ON COLUMN events.status IS 'DRAFT, PENDING_APPROVAL, PUBLISHED, or CANCELLED';
COMMENT ON COLUMN events.published_by IS 'Admin user who published the event';
```

**Field Descriptions**:
- `status`: DRAFT (editable), PENDING_APPROVAL (awaiting admin), PUBLISHED (live), CANCELLED
- `published_by`: Admin user ID who approved/published
- `total_tickets_available`: Sum of all ticket type quantities
- `tickets_sold`: Total tickets sold across all types

---

### 2.5 TICKET_TYPES Table

**Purpose**: Ticket types created by admin (applied to events)

```sql
CREATE TABLE ticket_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    default_price DECIMAL(10,2),
    created_by BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_ticket_types_creator FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_default_price CHECK (default_price IS NULL OR default_price >= 0)
);

-- Indexes
CREATE INDEX idx_ticket_type_created_by ON ticket_types(created_by);
CREATE INDEX idx_ticket_type_active ON ticket_types(is_active);

COMMENT ON TABLE ticket_types IS 'Reusable ticket types created by admin (VIP, General, Early Bird, etc.)';
COMMENT ON COLUMN ticket_types.default_price IS 'Default price, can be overridden per event';
```

**Examples**: VIP, General Admission, Early Bird, Student, Senior

---

### 2.6 EVENT_TICKET_TYPES Table (Join Table)

**Purpose**: Links events to ticket types with event-specific pricing and availability

```sql
CREATE TABLE event_ticket_types (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL,
    ticket_type_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity_available INTEGER NOT NULL DEFAULT 0,
    quantity_sold INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_event_ticket_event FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_ticket_type FOREIGN KEY (ticket_type_id) 
        REFERENCES ticket_types(id) ON DELETE RESTRICT,
    CONSTRAINT uq_event_ticket_type UNIQUE (event_id, ticket_type_id),
    CONSTRAINT chk_quantity_available CHECK (quantity_available >= 0),
    CONSTRAINT chk_quantity_sold CHECK (quantity_sold <= quantity_available),
    CONSTRAINT chk_price CHECK (price >= 0)
);

-- Indexes
CREATE INDEX idx_event_ticket_event ON event_ticket_types(event_id);
CREATE INDEX idx_event_ticket_type ON event_ticket_types(ticket_type_id);
CREATE INDEX idx_event_ticket_active ON event_ticket_types(event_id, is_active) WHERE is_active = TRUE;

COMMENT ON TABLE event_ticket_types IS 'Links events to ticket types with event-specific pricing and availability';
COMMENT ON COLUMN event_ticket_types.price IS 'Event-specific price (overrides ticket_type default_price)';
```

**Constraints**:
- One ticket type per event (unique constraint)
- Quantity sold cannot exceed available
- Cascade delete: if event deleted, ticket type links removed

---

### 2.7 TICKET_PURCHASES Table

**Purpose**: Records all ticket purchases (by registered users or guests)

```sql
CREATE TABLE ticket_purchases (
    id BIGSERIAL PRIMARY KEY,
    purchase_code VARCHAR(50) NOT NULL UNIQUE,
    qr_code_data TEXT NOT NULL,
    user_id BIGINT,
    event_id BIGINT NOT NULL,
    event_ticket_type_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20),
    purchase_status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    receipt_downloaded BOOLEAN DEFAULT FALSE NOT NULL,
    receipt_download_count INTEGER DEFAULT 0 NOT NULL,
    
    CONSTRAINT fk_purchase_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_purchase_event FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE RESTRICT,
    CONSTRAINT fk_purchase_ticket_type FOREIGN KEY (event_ticket_type_id) 
        REFERENCES event_ticket_types(id) ON DELETE RESTRICT,
    CONSTRAINT chk_purchase_quantity CHECK (quantity > 0),
    CONSTRAINT chk_purchase_amount CHECK (total_amount = unit_price * quantity),
    CONSTRAINT chk_purchase_status CHECK (purchase_status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'))
);

-- Indexes
CREATE INDEX idx_purchase_code ON ticket_purchases(purchase_code);
CREATE INDEX idx_purchase_user ON ticket_purchases(user_id);
CREATE INDEX idx_purchase_event ON ticket_purchases(event_id);
CREATE INDEX idx_purchase_status ON ticket_purchases(purchase_status);
CREATE INDEX idx_purchase_buyer_email ON ticket_purchases(buyer_email);
CREATE INDEX idx_purchase_date ON ticket_purchases(purchase_date);

COMMENT ON TABLE ticket_purchases IS 'Records all ticket purchases (registered users and guests)';
COMMENT ON COLUMN ticket_purchases.purchase_code IS 'Unique code for guest lookups (format: EVT-XXXXXX)';
COMMENT ON COLUMN ticket_purchases.user_id IS 'NULL for guest purchases, set for registered user purchases';
COMMENT ON COLUMN ticket_purchases.qr_code_data IS 'Base64 encoded QR code or QR code URL';
```

**Purchase Code Format**: `EVT-{random-alphanumeric}` (e.g., EVT-A1B2C3)

---

### 2.8 PAYMENT_TRANSACTIONS Table

**Purpose**: Stores payment transaction details

```sql
CREATE TABLE payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    ticket_purchase_id BIGINT NOT NULL UNIQUE,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    gateway_response JSONB,
    failure_reason TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_payment_purchase FOREIGN KEY (ticket_purchase_id) 
        REFERENCES ticket_purchases(id) ON DELETE RESTRICT,
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    CONSTRAINT chk_currency CHECK (currency IN ('USD', 'EUR', 'KES', 'NGN'))
);

-- Indexes
CREATE INDEX idx_payment_transaction_id ON payment_transactions(transaction_id);
CREATE INDEX idx_payment_status ON payment_transactions(payment_status);
CREATE INDEX idx_payment_purchase ON payment_transactions(ticket_purchase_id);
CREATE INDEX idx_payment_gateway ON payment_transactions(payment_gateway, payment_status);
CREATE INDEX idx_payment_processed_at ON payment_transactions(processed_at) WHERE processed_at IS NOT NULL;

COMMENT ON TABLE payment_transactions IS 'Payment transaction records from payment gateway';
COMMENT ON COLUMN payment_transactions.transaction_id IS 'Unique ID from payment gateway (Stripe, etc.)';
COMMENT ON COLUMN payment_transactions.gateway_response IS 'Full JSON response from payment gateway for audit';
```

**Payment Gateway Examples**: STRIPE, PAYPAL, MPESA, FLUTTERWAVE

---

### 2.9 COMMISSIONS Table

**Purpose**: Admin-set commission per event

```sql
CREATE TABLE commissions (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL UNIQUE,
    commission_type VARCHAR(20) NOT NULL,
    commission_value DECIMAL(10,2) NOT NULL,
    calculated_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
    set_by BIGINT NOT NULL,
    set_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes TEXT,
    
    CONSTRAINT fk_commission_event FOREIGN KEY (event_id) 
        REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_commission_set_by FOREIGN KEY (set_by) 
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_commission_type CHECK (commission_type IN ('PERCENTAGE', 'FIXED')),
    CONSTRAINT chk_commission_value CHECK (commission_value >= 0),
    CONSTRAINT chk_commission_percentage CHECK (
        commission_type = 'FIXED' OR (commission_type = 'PERCENTAGE' AND commission_value <= 100)
    )
);

-- Indexes
CREATE INDEX idx_commission_event ON commissions(event_id);
CREATE INDEX idx_commission_set_by ON commissions(set_by);

COMMENT ON TABLE commissions IS 'Commission settings per event, set by admin during event publishing';
COMMENT ON COLUMN commissions.commission_type IS 'PERCENTAGE (e.g., 10%) or FIXED (e.g., $50)';
COMMENT ON COLUMN commissions.commission_value IS 'Percentage (0-100) or fixed amount in dollars';
COMMENT ON COLUMN commissions.calculated_amount IS 'Running total of commission collected from ticket sales';
```

**Commission Calculation**:
- PERCENTAGE: `calculated_amount = SUM(purchase.total_amount) * (commission_value / 100)`
- FIXED: `calculated_amount = commission_value * COUNT(purchases)` (or fixed total per event)

---

### 2.10 EMAIL_NOTIFICATIONS Table (Optional - Audit/Logging)

**Purpose**: Track sent emails for auditing and debugging

```sql
CREATE TABLE email_notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    sent_at TIMESTAMP,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT chk_email_status CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'BOUNCED'))
);

-- Indexes
CREATE INDEX idx_email_recipient ON email_notifications(recipient_email);
CREATE INDEX idx_email_type ON email_notifications(email_type);
CREATE INDEX idx_email_status ON email_notifications(status);
CREATE INDEX idx_email_sent_at ON email_notifications(sent_at) WHERE sent_at IS NOT NULL;

COMMENT ON TABLE email_notifications IS 'Audit log of all emails sent by the system';
COMMENT ON COLUMN email_notifications.email_type IS 'EVENT_PUBLISHED, OTP, PURCHASE_CONFIRMATION, CREATOR_VERIFIED, etc.';
COMMENT ON COLUMN email_notifications.metadata IS 'Additional context (event_id, user_id, purchase_code, etc.)';
```

**Email Types**:
- `EVENT_PUBLISHED`: Notification to creator when event is published
- `OTP`: OTP code for creator verification
- `PURCHASE_CONFIRMATION`: Ticket purchase confirmation
- `CREATOR_VERIFIED`: Creator account verification confirmation
- `CREATOR_REJECTED`: Creator verification rejection
- `EVENT_REJECTED`: Event rejection notification

---

## 3. Relationships Summary

### Entity Relationship Diagram (Text Representation)

```
┌─────────────┐
│    USERS    │
│─────────────│
│ id (PK)     │◄──────┐
│ email       │       │
│ ...         │       │
└─────────────┘       │
      │               │
      │ 1             │ M
      │               │
      │ M             │
      ▼               │
┌─────────────┐       │
│USER_ROLES   │       │
│─────────────│       │
│ user_id (FK)├───────┘
│ role_id (FK)│
└──────┬──────┘
       │
       │ M
       │
       ▼
┌─────────────┐
│    ROLES    │
│─────────────│
│ id (PK)     │
│ name        │
└─────────────┘

┌─────────────┐
│    USERS    │
│─────────────│
│ id (PK)     │◄──────┐
└─────────────┘       │
      │               │
      │ 1             │ M
      │               │
      ▼               │
┌─────────────┐       │
│   EVENTS    │       │
│─────────────│       │
│ id (PK)     │       │
│ creator_id  ├───────┘
│ status      │
└──────┬──────┘
       │
       │ 1
       │
       │ M
       ▼
┌─────────────┐
│EVENT_TICKET │
│   _TYPES    │
│─────────────│
│ event_id    │
│ ticket_type │
│ price       │
│ quantity    │
└──────┬──────┘
       │
       │ 1
       │
       │ M
       ▼
┌─────────────┐
│   TICKET    │
│  PURCHASES  │
│─────────────│
│ id (PK)     │
│ user_id (FK)├───┐
│ event_id    │   │
│ ticket_type │   │
│ purchase_   │   │
│   code      │   │
└──────┬──────┘   │
       │          │
       │ 1        │
       │          │
       │ 1        │
       ▼          │
┌─────────────┐   │
│  PAYMENT    │   │
│TRANSACTIONS │   │
│─────────────│   │
│ purchase_id │   │
│ transaction │   │
│    _id      │   │
└─────────────┘   │
                  │
                  │
                  │
┌─────────────┐   │
│    USERS    │   │
│─────────────│   │
│ id (PK)     ├───┘
└─────────────┘
```

---

## 4. Database Constraints & Business Rules

### 4.1 Data Integrity Constraints

1. **Foreign Key Constraints**: All foreign keys have appropriate ON DELETE actions
   - CASCADE: Deleting event deletes related event_ticket_types, commissions
   - RESTRICT: Cannot delete user if they have events/purchases
   - SET NULL: Deleting user sets published_by to NULL, user_id in purchases to NULL

2. **Check Constraints**: Enforce business rules at database level
   - Status values are validated (enums)
   - Quantities cannot be negative
   - Dates are logical (end_date >= start_date)

3. **Unique Constraints**: Prevent duplicates
   - Email addresses unique
   - Purchase codes unique
   - Transaction IDs unique
   - One commission per event

### 4.2 Indexes Strategy

**Performance Indexes**:
- Primary keys: Automatic indexes
- Foreign keys: Indexed for join performance
- Frequently queried columns: email, status, purchase_code
- Composite indexes: (status, published_at) for published events query

**Covering Indexes** (if needed):
- (event_id, status) covering common queries
- (user_id, purchase_status) for user purchase history

---

## 5. Database Migration Strategy

### Using Flyway

**Migration Files** (in `src/main/resources/db/migration/`):
- `V1__Initial_schema.sql`: Create all tables
- `V2__Insert_default_roles.sql`: Insert ADMIN, USER, CREATOR roles
- `V3__Create_indexes.sql`: Performance indexes
- `V4__Seed_admin_user.sql`: Create initial admin user (optional, password should be changed)

**Version Naming**: `V{version}__{description}.sql`

---

## 6. Sample Data for Testing

### Default Roles (Pre-populated)
```sql
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Full system access'),
('USER', 'Regular user'),
('CREATOR', 'Event creator');
```

### Sample Admin User (Seed Data)
```sql
-- Password: Admin@123 (must be hashed with BCrypt)
INSERT INTO users (email, password_hash, first_name, last_name, email_verified, account_status)
VALUES ('admin@eventbooking.com', '$2a$10$...', 'Admin', 'User', TRUE, 'ACTIVE');

-- Assign ADMIN role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'admin@eventbooking.com' AND r.name = 'ADMIN';
```

---

## 7. Query Optimization Notes

### Common Queries to Optimize

1. **Published Events List**: Use composite index on (status, published_at)
2. **User Purchases**: Index on (user_id, purchase_date)
3. **Event Ticket Availability**: Index on (event_id, is_active) in event_ticket_types
4. **Purchase Code Lookup**: Unique index on purchase_code (already exists)

### Query Performance Tips

- Use `EXPLAIN ANALYZE` to analyze query plans
- Avoid N+1 queries in JPA (use JOIN FETCH)
- Use pagination for large result sets
- Cache frequently accessed data (event listings)

---

This schema design ensures data integrity, performance, and scalability for the event booking system.
