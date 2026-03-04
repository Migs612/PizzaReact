-- =============================================
-- PIZZA REACT - Database Schema (MySQL)
-- =============================================

CREATE DATABASE IF NOT EXISTS pizza_react;
USE pizza_react;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  points INT DEFAULT 89,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  ingredients TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category ENUM('Pizza', 'Bebida', 'Postre') NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('Pendiente', 'Preparando', 'En camino', 'Entregado') DEFAULT 'Pendiente',
  total DECIMAL(10, 2) NOT NULL,
  address_id INT DEFAULT NULL,
  payment_method_id INT DEFAULT NULL,
  earned_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de items del pedido
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  size ENUM('Small', 'Medium', 'XL') DEFAULT 'Medium',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de direcciones del usuario
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(50) DEFAULT 'Casa',
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Madrid',
  postal_code VARCHAR(10) NOT NULL DEFAULT '28001',
  phone VARCHAR(20) DEFAULT NULL,
  is_main TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de métodos de pago del usuario
CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  card_last4 VARCHAR(4) NOT NULL,
  exp_date VARCHAR(5) NOT NULL,
  is_main TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Usuario administrador (password: admin123) / Usuario normal (password: user123)
INSERT INTO users (name, email, password, points) VALUES
('Admin Pizza', 'admin@adminpizza.es', '$2a$10$t1YWhrFoGgeDRb4wsqqelOA/Idmkev8sVXPM.zxdj2pVRwuUorTAS', 89),
('Juan García', 'juan@email.com', '$2a$10$7znj1FlRIaMi6aYi0.L98OFsY6vtBt6xmCKpLgtkNVJCi6ovm8uXC', 89);

-- Productos: Pizzas
INSERT INTO products (name, description, ingredients, price, category, image_url) VALUES
('Pizza Margherita', 'La clásica italiana con tomate San Marzano, mozzarella fresca y albahaca', 'Tomate San Marzano, Mozzarella di Bufala, Albahaca fresca, Aceite de oliva virgen extra', 12.99, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800'),
('Pizza Pepperoni', 'Generosas rodajas de pepperoni sobre base de mozzarella fundida', 'Pepperoni artesanal, Mozzarella, Salsa de tomate casera, Orégano', 14.99, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800'),
('Pizza BBQ Chicken', 'Pollo marinado en salsa BBQ con cebolla caramelizada', 'Pollo a la parrilla, Salsa BBQ, Cebolla roja, Mozzarella, Cilantro', 16.99, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'),
('Pizza Quattro Formaggi', 'Cuatro quesos artesanales en perfecta armonía', 'Mozzarella, Gorgonzola, Parmesano, Fontina, Nueces', 15.99, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'),
('Pizza Hawaiana', 'La controversial favorita con piña dulce y jamón ahumado', 'Jamón ahumado, Piña natural, Mozzarella, Salsa de tomate', 13.99, 'Pizza', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800'),
('Pizza Vegana Verde', 'Explosión de vegetales frescos sobre base de pesto', 'Pesto vegano, Espinacas, Champiñones, Pimiento, Aceitunas, Tomate cherry', 14.99, 'Pizza', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800'),
('Pizza Diavola', 'Para los amantes del picante con nduja y guindilla', 'Nduja, Salami picante, Guindilla fresca, Mozzarella, Miel', 15.99, 'Pizza', 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=800'),
('Pizza Trufa Negra', 'Lujo en cada bocado con trufa negra y burrata', 'Trufa negra, Burrata, Champiñones Portobello, Aceite de trufa', 19.99, 'Pizza', 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800');

-- Productos: Bebidas
INSERT INTO products (name, description, ingredients, price, category, image_url) VALUES
('Coca-Cola', 'Refresco clásico bien frío', 'Coca-Cola Original 330ml', 2.99, 'Bebida', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800'),
('Agua Mineral', 'Agua mineral natural', 'Agua mineral 500ml', 1.99, 'Bebida', 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800'),
('Cerveza Artesanal', 'Cerveza artesanal italiana', 'Cerveza Moretti 330ml', 3.99, 'Bebida', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800'),
('Limonada Casera', 'Limonada natural con menta fresca', 'Limón, Menta, Azúcar de caña, Agua con gas', 3.49, 'Bebida', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800');

-- Productos: Postres
INSERT INTO products (name, description, ingredients, price, category, image_url) VALUES
('Tiramisú', 'El clásico postre italiano con capas de mascarpone', 'Mascarpone, Café espresso, Bizcocho, Cacao', 6.99, 'Postre', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800'),
('Panna Cotta', 'Suave crema italiana con coulis de frutos rojos', 'Nata, Vainilla, Gelatina, Frutos rojos', 5.99, 'Postre', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'),
('Brownie con Helado', 'Brownie caliente de chocolate con helado de vainilla', 'Chocolate 70%, Mantequilla, Nueces, Helado artesanal', 7.49, 'Postre', 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800'),
('Cannoli Siciliano', 'Crujiente masa rellena de ricotta dulce', 'Ricotta, Pistachos, Chocolate, Masa crujiente', 5.49, 'Postre', 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=800');
