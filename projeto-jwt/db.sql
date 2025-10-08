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

-- Cria a tabela de voluntários
CREATE TABLE IF NOT EXISTS volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insere dados de voluntários
INSERT INTO volunteers (name, phone, email) VALUES
('Voluntario 1', '(54) 99999-9991', 'vol1@email.com'),
('Voluntario 2', '(54) 99999-9992', 'vol2@email.com'),
('Voluntario 3', '(54) 99999-9993', NULL),
('Voluntario 4', '(54) 99999-9994', 'vol4@email.com'),
('Voluntario 5', '(54) 99999-9995', NULL);

-- Cria a tabela relacional entre eventos e voluntários
CREATE TABLE IF NOT EXISTS event_volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_volunteer (event_id, volunteer_id)
);

-- Insere dados de voluntários de eventos
INSERT INTO event_volunteers (event_id, volunteer_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 2),
(2, 4),
(3, 1),
(3, 5);