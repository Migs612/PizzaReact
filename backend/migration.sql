-- =============================================
-- PIZZA REACT - Migration: addresses, payment_methods, orders update
-- Run: mysql -u root pizza_react < backend/migration.sql
-- =============================================

USE pizza_react;

-- -----------------------------------------------
-- 1. Tabla de direcciones del usuario
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS addresses (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  label       VARCHAR(50)  DEFAULT 'Casa',
  street      VARCHAR(255) NOT NULL,
  city        VARCHAR(100) NOT NULL DEFAULT 'Madrid',
  postal_code VARCHAR(10)  NOT NULL DEFAULT '28001',
  phone       VARCHAR(20)  DEFAULT NULL,
  is_main     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------
-- 2. Tabla de métodos de pago del usuario
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS payment_methods (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  card_last4  VARCHAR(4)  NOT NULL,
  exp_date    VARCHAR(5)  NOT NULL,
  is_main     TINYINT(1)  NOT NULL DEFAULT 0,
  created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------
-- 3. Actualizar tabla orders (add address_id, payment_method_id, earned_points)
--    Usamos ALTER TABLE con IF NOT EXISTS check via procedure
-- -----------------------------------------------
-- address_id
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'pizza_react' AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'address_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE orders ADD COLUMN address_id INT DEFAULT NULL AFTER total',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- payment_method_id
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'pizza_react' AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'payment_method_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE orders ADD COLUMN payment_method_id INT DEFAULT NULL AFTER address_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- earned_points
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'pizza_react' AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'earned_points');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE orders ADD COLUMN earned_points INT DEFAULT 0 AFTER payment_method_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- -----------------------------------------------
-- 4. Corregir hashes de contraseñas si son inválidos
--    admin@adminpizza.es → admin123
--    juan@email.com      → user123
-- -----------------------------------------------
UPDATE users SET password = '$2a$10$LqB4WMiZ/YcEa8MbaEt/r.BJGWtbfGOlNPoM6ZrARvAjxjY2QphDi'
  WHERE email = 'admin@adminpizza.es'
    AND password = '$2b$10$xJwG5Y5F3Q9X3J2z3Q9X3OxJwG5Y5F3Q9X3J2z3Q9X3O';

UPDATE users SET password = '$2a$10$K7xIbsKnQ7eIsIcUwmZBVuF3.WiE04iytOg5beuDIG5EapjOeApYO'
  WHERE email = 'juan@email.com'
    AND password = '$2b$10$xJwG5Y5F3Q9X3J2z3Q9X3OxJwG5Y5F3Q9X3J2z3Q9X3O';

SELECT 'Migration completed successfully.' AS result;
