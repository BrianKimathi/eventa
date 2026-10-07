-- Insert default roles
INSERT INTO roles (name, description) VALUES
('USER', 'Regular user who can browse and purchase tickets'),
('CREATOR', 'Verified user who can create events'),
('ADMIN', 'Administrator with full system access')
ON CONFLICT (name) DO NOTHING;