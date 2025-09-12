-- Данные для identity_db
\c identity_db

INSERT INTO roles (id, name, description) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin', 'Администратор системы'),
('22222222-2222-2222-2222-222222222222', 'customer', 'Клиент')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password_hash, first_name, last_name, phone, is_verified, is_active) VALUES 
('44444444-4444-4444-4444-444444444444', 'admin@carrental.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'System', '+1234567890', true, true),
('55555555-5555-5555-5555-555555555555', 'user@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '+1234567891', true, true)
ON CONFLICT (id) DO NOTHING;

-- Данные для cars_db
\c cars_db

INSERT INTO car_categories (id, name, daily_rate) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Economy', 25.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SUV', 60.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Luxury', 120.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cars (id, category_id, license_plate, brand, model, year, color, daily_rate) VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ABC123', 'Toyota', 'Corolla', 2023, 'Red', 30.00),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'XYZ789', 'BMW', 'X5', 2023, 'Black', 80.00)
ON CONFLICT (id) DO NOTHING;

-- Возвращаемся в главную БД
\c postgres

SELECT 'All test data inserted successfully!' as status;