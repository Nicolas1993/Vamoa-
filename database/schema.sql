PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    data_criacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS viagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    destino TEXT NOT NULL,
    localizacao TEXT,
    data_ida TEXT,
    data_volta TEXT,
    valor_estimado REAL NOT NULL DEFAULT 0,
    quantidade_pessoas INTEGER NOT NULL DEFAULT 1,
    hospedagem TEXT,
    transporte TEXT,
    imagem TEXT,
    rating REAL DEFAULT 0,
    tag TEXT,
    data_criacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    viagem_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    valor_total REAL NOT NULL,
    data_reserva TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (viagem_id) REFERENCES viagens(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reserva_id INTEGER NOT NULL,
    metodo TEXT NOT NULL,
    valor REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    data_pagamento TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE
);

INSERT INTO usuarios (nome, email, senha) VALUES
    ('Usuário Demo', 'demo@vamoae.com', '123456'),
    ('Maria Souza', 'maria@vamoae.com', '123456');

INSERT INTO viagens (titulo, destino, localizacao, data_ida, data_volta, valor_estimado, quantidade_pessoas, hospedagem, transporte, imagem, rating, tag) VALUES
    ('Praia de Copacabana', 'Rio de Janeiro', 'Rio de Janeiro', '10/01/2027', '15/01/2027', 680.00, 2, 'Hotel Copacabana Palace', 'Avião', 'https://i.pinimg.com/736x/4f/31/03/4f3103015fb580368b4c8000c03d5a8f.jpg', 4.9, 'Mais procurada'),
    ('Paris', 'Paris, França', 'Paris, França', '20/02/2027', '24/02/2027', 820.00, 2, 'Hotel Eiffel', 'Avião', 'https://i.pinimg.com/736x/e9/8f/2c/e98f2c723a8686fc228adad6c905ebc9.jpg', 4.8, 'Trending'),
    ('Gramado e Serra', 'Rio Grande do Sul', 'Rio Grande do Sul', '05/03/2027', '08/03/2027', 760.00, 4, 'Pousada da Serra', 'Carro', 'https://i.pinimg.com/1200x/4f/c7/a6/4fc7a6bc690d57666bae3856379787c1.jpg', 4.7, 'Top 10');

INSERT INTO reservas (usuario_id, viagem_id, status, valor_total) VALUES
    (1, 1, 'confirmada', 1360.00),
    (2, 2, 'pendente', 1640.00);

INSERT INTO pagamentos (reserva_id, metodo, valor, status) VALUES
    (1, 'cartao', 1360.00, 'pago'),
    (2, 'pix', 1640.00, 'pendente');
