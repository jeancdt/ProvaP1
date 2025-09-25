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

-- Insere eventos fictícios
INSERT INTO events (title, description, location, start_date, end_date) VALUES
('Doação de Sangue', 'Campanha de doação de sangue aberta à comunidade.', 'Hospital Municipal', '2025-10-10 09:00:00', '2025-10-10 17:00:00'),
('Mutirão Ambiental', 'Limpeza do Parque Central e plantio de mudas.', 'Parque Central', '2025-10-20 08:00:00', '2025-10-20 12:00:00'),
('Arrecadação de Alimentos', 'Coleta de alimentos não perecíveis para famílias carentes.', 'Ginásio da Escola', '2025-11-05 10:00:00', '2025-11-05 16:00:00');