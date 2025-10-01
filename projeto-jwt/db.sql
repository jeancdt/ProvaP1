-- Cria o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS projeto_jwt_db CHARACTER SET utf8mb4 COLLATE
utf8mb4_unicode_ci;

-- Usa o banco de dados
USE projeto_jwt_db;

-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(255) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 role VARCHAR(50) NOT NULL DEFAULT 'user',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insere dois tipos de usuários
INSERT INTO users (email, password, role) VALUES
('usuario@ifrs.edu.br',
'$2b$10$382cEJJYi5YxSBNvWmufHeoPHX3dqIB9NP2R2XWzt/w.DnC0gmCr2', 'user'),
('admin@ifrs.edu.br',
'$2b$10$/JLXJ62EBlk1bNq0xmpvMuTLDJb6AWmZUs74lgEJb4Z.J9.3kFJM.', 'admin');

-- Cria a tabela de eventos
CREATE TABLE IF NOT EXISTS events (
 id INT AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(255) NOT NULL,
 description TEXT,
 location VARCHAR(255),
 start_date DATETIME NOT NULL,
 end_date DATETIME NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insere eventos
INSERT INTO events (title, description, location, start_date, end_date) VALUES
('Evento 1', 'Desc Evento 1', 'Local Evento 1', '2025-10-10 09:00:00', '2025-10-10 17:00:00'),
('Evento 2', 'Desc Evento 2', 'Local Evento 2', '2025-10-10 09:00:00', '2025-10-10 17:00:00'),
('Evento 3', 'Desc Evento 3', 'Local Evento 3', '2025-10-10 09:00:00', '2025-10-10 17:00:00');