CREATE DATABASE grading_portal;

USE grading_portal;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    usertype ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);
