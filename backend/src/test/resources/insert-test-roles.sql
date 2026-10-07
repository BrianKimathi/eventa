-- Insert roles for tests (tables created by Hibernate)
INSERT INTO roles (name, description, created_at, updated_at) VALUES
('USER', 'Regular user who can browse and purchase tickets', NOW(), NOW()),
('CREATOR', 'Verified user who can create events', NOW(), NOW()),
('ADMIN', 'Administrator with full system access', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;