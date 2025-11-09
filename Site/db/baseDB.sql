CREATE TABLE
    IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        uuid VARCHAR(255) UNIQUE,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255) NOT NULL DEFAULT '/default/defaultAvatar.png',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )