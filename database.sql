create SCHEMA IF NOT EXISTS ProjISW DEFAULT CHARACTER SET utf8;

USE ProjISW;

CREATE TABLE users (
    username VARCHAR(30) NOT NULL,
    email VARCHAR(50) PRIMARY KEY,
    hashPassword VARCHAR(82) NOT NULL UNIQUE
);

CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roomName VARCHAR(40),
    roomCreator varchar(50),
    FOREIGN key (roomCreator) REFERENCES users (email)
);

ALTER TABLE rooms AUTO_INCREMENT = 0;

CREATE TABLE bannedUsers (
    email VARCHAR(50),
    id INT,
    inizio_sospensione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fine_sospensione TIMESTAMP NULL,
    PRIMARY KEY (email, id),
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (id) REFERENCES rooms(id)
);

CREATE TABLE moderators (
    email VARCHAR(50),
    id INT,
    PRIMARY KEY (email, id),
    FOREIGN KEY (email) REFERENCES users(email),
    FOREIGN KEY (id) REFERENCES rooms(id)
);

-- insert into bannedusers (email, fine_sospensione, id) value ('rocco@aww', '2024-01-28 15:00:00', 0) 