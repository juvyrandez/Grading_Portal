CREATE DATABASE grading_portal;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('user', 'admin', 'programhead') NOT NULL DEFAULT 'user',
    course VARCHAR(100) DEFAULT NULL,
    year_level INT DEFAULT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT NULL,
    birthdate DATE DEFAULT NULL,
    contact_number VARCHAR(15) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    profile_img VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_year_id INT NULL, -- added directly after id
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('user', 'admin', 'programhead') NOT NULL DEFAULT 'user',
    course VARCHAR(100) DEFAULT NULL,
    year_level INT DEFAULT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT NULL,
    birthdate DATE DEFAULT NULL,
    contact_number VARCHAR(15) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    profile_img VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_school_year FOREIGN KEY (school_year_id) REFERENCES school_years(id)
);








CREATE TABLE program_head (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    department_type ENUM('Academic', 'Non-Academic') NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active'
);


CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    department VARCHAR(50) NOT NULL,
    year_level VARCHAR(20) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    units INT NOT NULL
);




CREATE TABLE student_grades (
    grade_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    midterm FLOAT DEFAULT NULL,
    final FLOAT DEFAULT NULL,
    general FLOAT DEFAULT NULL,
    remarks VARCHAR(100) DEFAULT NULL,
    is_irregular BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);




CREATE TABLE irregular_student_subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  semester VARCHAR(20) NOT NULL,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);


CREATE TABLE dropped_regular_subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  dropped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

CREATE TABLE school_years (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_year INT NOT NULL,
  end_year INT NOT NULL,
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Inactive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY year_range (start_year, end_year)
);

