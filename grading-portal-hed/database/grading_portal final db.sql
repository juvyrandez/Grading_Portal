-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2025 at 01:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grading_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `dropped_regular_subjects`
--

CREATE TABLE `dropped_regular_subjects` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `dropped_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dropped_regular_subjects`
--

INSERT INTO `dropped_regular_subjects` (`id`, `student_id`, `subject_id`, `dropped_at`) VALUES
(5, 2, 16, '2025-05-03 05:59:14'),
(6, 3, 16, '2025-05-03 06:01:04'),
(7, 5, 13, '2025-05-22 20:51:28');

-- --------------------------------------------------------

--
-- Table structure for table `irregular_student_subjects`
--

CREATE TABLE `irregular_student_subjects` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `semester` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `irregular_student_subjects`
--

INSERT INTO `irregular_student_subjects` (`id`, `student_id`, `subject_id`, `semester`) VALUES
(5, 3, 7, '1st Semester');

-- --------------------------------------------------------

--
-- Table structure for table `program_head`
--

CREATE TABLE `program_head` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `department_type` enum('Academic','Non-Academic') NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_head`
--

INSERT INTO `program_head` (`id`, `name`, `email`, `password`, `department`, `department_type`, `status`) VALUES
(1, 'Liezel Rodrigo', 'liezel@gmail.com', '$2b$10$Xz5F3BAqHOMxb7W2fheiRO3JiguqyLitWNvbpOrhTwxsI37lbhlHO', 'BSIT', 'Academic', 'Active'),
(2, 'Rey John Bongcas', 'rey@gmail.com', '$2b$10$fSusKK4at/6Gj8jA4KChz.JD/micCiy8SxooVFYlpqA6lEpeY2zzS', 'CJEP', 'Academic', 'Active'),
(3, 'Jhon Doe', 'doe@gmail.com', '$2b$10$79TmCJWaruG9SW6umGg8Le8k9EVpKFBQspXq2BtZ8ACQHheP7R.oy', 'BSBA', 'Academic', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `school_years`
--

CREATE TABLE `school_years` (
  `id` int(11) NOT NULL,
  `start_year` int(11) NOT NULL,
  `end_year` int(11) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_years`
--

INSERT INTO `school_years` (`id`, `start_year`, `end_year`, `status`, `created_at`) VALUES
(1, 2021, 2022, 'Inactive', '2025-05-20 22:40:23'),
(2, 2020, 2021, 'Inactive', '2025-05-21 08:57:28'),
(4, 2024, 2025, 'Active', '2025-05-23 22:56:10');

-- --------------------------------------------------------

--
-- Table structure for table `student_grades`
--

CREATE TABLE `student_grades` (
  `grade_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `midterm` float DEFAULT NULL,
  `final` float DEFAULT NULL,
  `general` float DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `is_irregular` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_grades`
--

INSERT INTO `student_grades` (`grade_id`, `student_id`, `subject_id`, `midterm`, `final`, `general`, `remarks`, `is_irregular`) VALUES
(7, 8, 11, 1.5, 1.4, 1.43, 'Passed', 0),
(8, 7, 11, 1.5, 1.2, 1.29, 'Passed', 0),
(9, 4, 11, 1.2, 1.5, 1.41, 'Passed', 0),
(10, 4, 12, 1.25, 2, 1.77, 'Passed', 0),
(11, 4, 13, 1.25, 1, 1.07, 'Passed', 0),
(12, 4, 14, 1.2, 1.5, 1.41, 'Passed', 0),
(13, 4, 15, 2, 1.5, 1.65, 'Passed', 0),
(14, 2, 11, 1.5, 2.5, 2.2, 'Passed', 0),
(16, 4, 16, 1.25, 1.25, 1.25, 'Passed', 0);

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `department` varchar(50) NOT NULL,
  `year_level` varchar(20) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `subject_code` varchar(20) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `units` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `department`, `year_level`, `semester`, `subject_code`, `subject_name`, `units`) VALUES
(4, 'BSIT', '2nd Year', '1st Semester', 'GE EL1', 'Entrepreneurial Mind', 3),
(5, 'BSIT', '2nd Year', '1st Semester', 'IFP 2', 'Ignacian Spiritual for Mission ', 3),
(6, 'BSIT', '2nd Year', '1st Semester', 'PE 4 ', 'Physical Activity Towards Health and Fitness 4', 2),
(7, 'BSIT', '2nd Year', '1st Semester', 'ITP 204 ', 'Fundamental of Database System ', 5),
(8, 'BSIT', '2nd Year', '1st Semester', 'ITP 205 ', 'Advanced Networking', 5),
(9, 'BSIT', '2nd Year', '1st Semester', 'ITP 206', 'Integrative Programming Technologies 1', 5),
(10, 'BSIT', '2nd Year', '1st Semester', 'ITC 202 ', 'Application Development and Emerging Technologies ', 5),
(11, 'BSIT', '3rd Year', '1st Semester', 'GE GAS', 'Gender and Society ', 3),
(12, 'BSIT', '3rd Year', '1st Semester', 'ITP 306', 'Information Assurance and Security 1', 5),
(13, 'BSIT', '3rd Year', '1st Semester', 'ITP 307', 'System Administration and Maintenance 2', 5),
(14, 'BSIT', '3rd Year', '1st Semester', 'ITP 308', 'Capstone Project and Research 1', 5),
(15, 'BSIT', '3rd Year', '1st Semester', 'ITE 301 ', 'Elective: Web System and Technologies', 5),
(16, 'BSIT', '3rd Year', '1st Semester', 'ITE 302', 'Elective: Systems Integration and Architecture', 5),
(17, 'BSIT', '3rd Year', '2nd Semester', 'ITP-101', 'Programming 1', 3),
(18, 'BSIT', '1st Year', '1st Semester', 'ITE-101', 'Programming Dev', 3),
(19, 'BSIT', '1st Year', '1st Semester', 'ITE-102', 'Introduction of Computers', 3),
(20, 'BSIT', '1st Year', '1st Semester', 'PE-1', 'Physical Healths', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `school_year_id` int(11) DEFAULT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('user','admin','programhead') NOT NULL DEFAULT 'user',
  `course` varchar(100) DEFAULT NULL,
  `year_level` int(11) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `profile_img` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `school_year_id`, `fullname`, `email`, `username`, `password`, `user_type`, `course`, `year_level`, `gender`, `birthdate`, `contact_number`, `address`, `status`, `profile_img`, `created_at`) VALUES
(1, NULL, 'SRCB ADMIN', 'admin@gmail.com', 'admin', '$2b$10$g59qhJWHUEdeGmMpc6Q7AO1Rmx8aef09G0sp9xbEVpQv/8cuxb7Pa', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, 'Active', NULL, '2025-04-21 00:56:13'),
(2, NULL, 'Juvy Jr. Durado Randez', 'juv@gmail.com', 'juv', '$2b$10$Ec1z7jd6ymfB0NimW2IQCuOJHw6xJxINpsTqiJPJKECNFZZV3WLfq', 'user', 'BSIT', 3, 'Female', '2003-09-25', '09075043422', ' Upper Musi-musi Blanco, Balingasag, Misamis,Oriental', 'Active', NULL, '2025-04-27 10:27:05'),
(3, NULL, 'Mechaela G. Abecia', 'mikay@gmail.com', 'mikay', '$2b$10$aCIC04pBlHl1ixVpw1weuuA6QdVNWeXUxG8p0u3myHjj6upPI2oc2', 'user', 'BSIT', 3, 'Female', '2003-03-20', '09877846352', 'haha', 'Active', 'profile_1746232371399.png', '2025-04-27 20:03:43'),
(4, NULL, 'Nazefhawk Aquitan Lague', 'naz@gmail.com', 'naz', '$2b$10$EJlgPGfbRaEzIIP5kT/pv.IS8wuYvL9d7FBnlzPsm48TmYyERR8fS', 'user', 'BSIT', 3, 'Male', '2003-02-26', '09073424534', 'Brgy 1', 'Active', NULL, '2025-04-28 10:52:35'),
(5, NULL, 'Milourence Cagampang Galendez', 'milo@gmail.com', 'renz', '$2b$10$sRbX01/NCELXVSbp/9mAbOjQiexzRnavZNEiWvUxAQyr095V5XQpq', 'user', 'BSIT', 3, 'Male', '2003-03-23', '09546342342', 'Talusan\n', 'Active', NULL, '2025-04-28 10:58:54'),
(6, NULL, 'Ronnel C Japus', 'ronnel@gmail.com', 'ronz', '$2b$10$v5fcuIhz5nzB1p1SbhCkN.1s.xNlnZmJ6E5dTy7uTuzWlv00omgSK', 'user', 'BSIT', 3, 'Male', '2004-02-01', '09546342323', 'Balingasag', 'Active', NULL, '2025-04-28 11:00:01'),
(7, NULL, 'Cyrus  B Dagoc', 'cyrus@gmail.com', 'cycy', '$2b$10$J.7XzZSIoqfvm90wRSC7rO2zFAfMJMO5m7n561sfPHN4eWWv/uEce', 'user', 'BSIT', 3, 'Male', '2003-01-02', '09546334343', 'Binitinan', 'Active', NULL, '2025-04-28 11:00:55'),
(8, NULL, 'Alyza  Ty Nunag', 'lyy@gmail.com', 'lyyy', '$2b$10$4cHv1dgaOmf4rPI1GVUy5uzVlKXKG/mbGLIrv2SY8UKLMk.7dExoa', 'user', 'BSIT', 3, 'Female', '2003-04-02', '09542452454', 'Salay', 'Active', NULL, '2025-04-28 11:02:45'),
(9, NULL, 'Shania Pink Pajaron', 'shan@gmail.com', 'shan', '$2b$10$6xKue1CKxzep6sRtRpQK6.IlF9Oz.tQ9.i5NtCb9iWVpwZFEqoLPu', 'user', 'CJEP', 3, 'Female', '2003-12-10', '09054523123', 'Binitinan', 'Active', NULL, '2025-05-03 01:09:31'),
(10, NULL, 'Alexander  Cruz', 'cruz@gmail.com', 'cruz', '$2b$10$fA0ElLmFLhkAOMv7y6qY.ObIC19vkTqnNIjGYuOSBxn5TQYIj2HCq', 'user', 'CJEP', 2, 'Male', '2003-12-02', '09874234324', 'Dumarait', 'Active', NULL, '2025-05-03 01:18:42'),
(11, NULL, 'Isabel B Cabana', 'sabel@gmail.com', 'sabel', '$2b$10$3BvaiLW7Csvpi/3t.okz3.JiGPze.Ea/MR.8T0eujL6izSxkMcPLa', 'user', 'BSBA', 3, 'Female', '2000-03-15', '09434214123', 'Dumarait', 'Active', NULL, '2025-05-03 01:20:25'),
(12, NULL, 'Bianca  Santos', 'santos@gmail.com', 'cakes', '$2b$10$1kH6p2DHNpi/NqQykdeVkuTHJyzi.xR8W3cMcKDzQfPSr5WQyIAou', 'user', 'BSBA', 3, 'Female', '2003-02-04', '09524524524', 'Balingasag Brgy 1', 'Active', NULL, '2025-05-03 01:22:42'),
(13, NULL, 'Jhon Doe', 'jan@gmail.com', 'jan', '$2b$10$.xayGdPVE2G3eXETpjQFBeKAcR5JQNpPx1obRbNgDfTR2jBHtHK8e', 'user', 'TEP', 2, 'Male', '2004-04-02', '09552123143', 'United States', 'Active', NULL, '2025-05-03 01:24:10'),
(14, NULL, 'Daniela  Lopez', 'dan@gmail.com', 'daniela', '$2b$10$4krhcbhlqpid2zpU6nJdnOw8KtIH4bBYC286fmj9RGhwUo..FWPrm', 'user', 'HM', 1, 'Male', '2003-03-03', '09121354675', 'Salay Misamis, Oriental', 'Active', NULL, '2025-05-03 01:26:05'),
(16, 1, 'fsdf dsfsdfds fsdf', 'fsdfsd@gmail.com', 'dsfdsf', '$2b$10$SJdBo/KsYwjU14Voo6KRNemid42EOLo3BYyQ1fcWSwWqjHfa2LOYe', 'user', 'CJEP', 2, 'Male', '0344-12-02', '53453245345', 'gfsgf', 'Active', NULL, '2025-05-21 09:02:06'),
(17, 1, 'trtrr rtrt rtrt', 'rtrtr@gmail.com', 'rtrtr', '$2b$10$kURII/6vl4RTdYi1U5a6muoWgdNZnxgwTum70eQVAASYrDaoyhEXO', 'user', 'CJEP', 1, 'Female', '0041-02-24', '53456356564', 'rtrr', 'Active', NULL, '2025-05-21 09:05:38'),
(18, 2, 'fgdfgdf dfgdfg dfgdfg', 'fgfdgdfg@gmail.com', 'fgdfg', '$2b$10$oT74ZtzkKo48hEmj8kMfa.W/ahZHvn92p/F8wq2iiGhzcieLefIeO', 'user', 'BSIT', 1, 'Male', '0056-06-05', '08768567654', 'dfdfd', 'Active', NULL, '2025-05-21 09:06:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dropped_regular_subjects`
--
ALTER TABLE `dropped_regular_subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `irregular_student_subjects`
--
ALTER TABLE `irregular_student_subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `program_head`
--
ALTER TABLE `program_head`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `school_years`
--
ALTER TABLE `school_years`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `year_range` (`start_year`,`end_year`);

--
-- Indexes for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD PRIMARY KEY (`grade_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_user_school_year` (`school_year_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dropped_regular_subjects`
--
ALTER TABLE `dropped_regular_subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `irregular_student_subjects`
--
ALTER TABLE `irregular_student_subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `program_head`
--
ALTER TABLE `program_head`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `school_years`
--
ALTER TABLE `school_years`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `student_grades`
--
ALTER TABLE `student_grades`
  MODIFY `grade_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dropped_regular_subjects`
--
ALTER TABLE `dropped_regular_subjects`
  ADD CONSTRAINT `dropped_regular_subjects_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `dropped_regular_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints for table `irregular_student_subjects`
--
ALTER TABLE `irregular_student_subjects`
  ADD CONSTRAINT `irregular_student_subjects_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `irregular_student_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD CONSTRAINT `student_grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `student_grades_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_school_year` FOREIGN KEY (`school_year_id`) REFERENCES `school_years` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
