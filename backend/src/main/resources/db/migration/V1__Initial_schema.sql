-- ============================================
-- Event Booking Platform - Initial Schema
-- Version: 1
-- ============================================

-- Create ENUM types for PostgreSQL (if needed, or use VARCHAR)
-- Note: We're using VARCHAR with CHECK constraints for cross-database compatibility

-- ============================================
-- 1. ROLES TABLE
-- ============================================
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role_name CHECK (name IN ('USER', 'CREATOR', 'ADMIN'))
);

CREATE INDEX idx_roles_name ON roles(name);

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    creator_verification_status VARCHAR(50) NOT NULL DEFAULT 'NOT_REQUESTED',
    creator_verification_otp VARCHAR(6),
    otp_expiry_time TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_creator_status CHECK (creator_verification_status IN ('NOT_REQUESTED', 'PENDING', 'VERIFIED'))
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_active ON users(is_active);

-- ============================================
-- 3. USER_ROLES TABLE (Many-to-Many junction)
-- ============================================
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_role UNIQUE (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- ============================================
-- 4. EVENTS TABLE
-- ============================================
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    image_url VARCHAR(500),
    total_capacity INTEGER NOT NULL,
    available_tickets INTEGER NOT NULL,
    creator_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_event_status CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'CANCELLED')),
    CONSTRAINT chk_event_dates CHECK (end_date > start_date),
    CONSTRAINT chk_event_capacity CHECK (total_capacity > 0 AND available_tickets >= 0 AND available_tickets <= total_capacity)
);

CREATE INDEX idx_event_status ON events(status);
CREATE INDEX idx_event_creator ON events(creator_id);
CREATE INDEX idx_event_start_date ON events(start_date);

-- ============================================
-- 5. TICKET_TYPES TABLE
-- ============================================
CREATE TABLE ticket_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    capacity INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ticket_price CHECK (price > 0),
    CONSTRAINT chk_ticket_capacity CHECK (capacity IS NULL OR capacity > 0)
);

-- ============================================
-- 6. EVENT_TICKET_TYPES TABLE (Junction with price override)
-- ============================================
CREATE TABLE event_ticket_types (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    ticket_type_id BIGINT NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_event_ticket_type UNIQUE (event_id, ticket_type_id),
    CONSTRAINT chk_event_ticket_price CHECK (price > 0),
    CONSTRAINT chk_event_ticket_quantity CHECK (available_quantity >= 0)
);

CREATE INDEX idx_event_ticket_types_event ON event_ticket_types(event_id);
CREATE INDEX idx_event_ticket_types_ticket ON event_ticket_types(ticket_type_id);

-- ============================================
-- 7. TICKET_PURCHASES TABLE
-- ============================================
CREATE TABLE ticket_purchases (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    ticket_type_id BIGINT NOT NULL REFERENCES ticket_types(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    purchase_code VARCHAR(50) NOT NULL UNIQUE,
    qr_code_data TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    purchase_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_purchase_quantity CHECK (quantity > 0),
    CONSTRAINT chk_purchase_amount CHECK (total_amount > 0),
    CONSTRAINT chk_purchase_status CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED'))
);

CREATE UNIQUE INDEX idx_purchase_code ON ticket_purchases(purchase_code);
CREATE INDEX idx_purchase_user ON ticket_purchases(user_id);
CREATE INDEX idx_purchase_event ON ticket_purchases(event_id);
CREATE INDEX idx_purchase_status ON ticket_purchases(status);

-- ============================================
-- 8. PAYMENT_TRANSACTIONS TABLE
-- ============================================
CREATE TABLE payment_transactions (
    id BIGSERIAL PRIMARY KEY,
    ticket_purchase_id BIGINT NOT NULL UNIQUE REFERENCES ticket_purchases(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    failure_reason VARCHAR(500),
    transaction_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    CONSTRAINT chk_payment_currency CHECK (currency IN ('USD', 'EUR', 'GBP', 'KES'))
);

CREATE INDEX idx_payment_status ON payment_transactions(status);
CREATE INDEX idx_payment_stripe_id ON payment_transactions(stripe_payment_intent_id);

-- ============================================
-- 9. COMMISSIONS TABLE
-- ============================================
CREATE TABLE commissions (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    commission_type VARCHAR(50) NOT NULL,
    commission_rate DECIMAL(5, 2),
    fixed_amount DECIMAL(10, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_commission_type CHECK (commission_type IN ('PERCENTAGE', 'FIXED')),
    CONSTRAINT chk_commission_rate CHECK (commission_rate IS NULL OR commission_rate >= 0),
    CONSTRAINT chk_commission_fixed CHECK (fixed_amount IS NULL OR fixed_amount >= 0),
    CONSTRAINT chk_commission_values CHECK (
        (commission_type = 'PERCENTAGE' AND commission_rate IS NOT NULL) OR
        (commission_type = 'FIXED' AND fixed_amount IS NOT NULL)
    )
);

-- ============================================
-- 10. EMAIL_NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE email_notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_email_status CHECK (status IN ('PENDING', 'SENT', 'FAILED'))
);

CREATE INDEX idx_email_status ON email_notifications(status);
CREATE INDEX idx_email_recipient ON email_notifications(recipient_email);

-- ============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_types_updated_at BEFORE UPDATE ON ticket_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_ticket_types_updated_at BEFORE UPDATE ON event_ticket_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_purchases_updated_at BEFORE UPDATE ON ticket_purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();