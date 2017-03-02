-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2017 at 11:05 AM
-- Server version: 10.1.19-MariaDB
-- PHP Version: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `text_free`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `c_id` int(11) NOT NULL,
  `user_one` int(11) NOT NULL DEFAULT '0',
  `user_two` int(11) NOT NULL DEFAULT '0',
  `time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`c_id`, `user_one`, `user_two`, `time`) VALUES
(40, 194, 195, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `conversation_reply`
--

CREATE TABLE `conversation_reply` (
  `cr_id` int(11) NOT NULL,
  `reply` text,
  `user_id_fk` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `c_id_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `friend_one` int(11) NOT NULL DEFAULT '0',
  `friend_two` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`friend_one`, `friend_two`) VALUES
(0, 0),
(180, 181),
(180, 182),
(181, 192),
(182, 181),
(182, 185),
(186, 181);

-- --------------------------------------------------------

--
-- Table structure for table `gcm_users`
--

CREATE TABLE `gcm_users` (
  `id` int(11) NOT NULL,
  `gcm_regid` text,
  `name` varchar(50) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(20) NOT NULL,
  `email` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gcm_users`
--

INSERT INTO `gcm_users` (`id`, `gcm_regid`, `name`, `username`, `password`, `email`, `created_at`) VALUES
(194, NULL, '', 'hien1', '123', 'hie1n@gmail.com', '2017-03-02 08:36:04'),
(195, NULL, '', 'hien2', '123', 'hien2@gmail.com', '2017-03-02 09:48:55');

-- --------------------------------------------------------

--
-- Table structure for table `group`
--

CREATE TABLE `group` (
  `id` int(11) NOT NULL,
  `name` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `group`
--

INSERT INTO `group` (`id`, `name`) VALUES
(38, 'gm: a1, a2.'),
(39, 'gm: a1, t1.'),
(41, 'gn: a1, a2, t1.');

-- --------------------------------------------------------

--
-- Table structure for table `group_logged_user`
--

CREATE TABLE `group_logged_user` (
  `id` int(11) NOT NULL,
  `g_id` int(11) DEFAULT NULL,
  `u_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `group_logged_user`
--

INSERT INTO `group_logged_user` (`id`, `g_id`, `u_id`) VALUES
(63, 38, 180),
(64, 38, 182),
(65, 39, 182),
(66, 39, 181),
(69, 41, 182),
(70, 41, 180),
(71, 41, 181);

-- --------------------------------------------------------

--
-- Table structure for table `group_reply`
--

CREATE TABLE `group_reply` (
  `id` int(11) NOT NULL,
  `g_id` int(11) DEFAULT NULL,
  `u_id` int(11) DEFAULT NULL,
  `reply` text,
  `time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `group_reply`
--

INSERT INTO `group_reply` (`id`, `g_id`, `u_id`, `reply`, `time`) VALUES
(100, 38, 182, 'chao group a1, a2', 1432786377),
(101, 39, 181, 'chao group t1, a1', 1432786493),
(102, 38, 180, 'a2: anh khoe, chu a1 the nao04.png|', 1432800329),
(104, 38, 182, 'a1: em khoe, bac dang lam gi the?14.png|', 1432804877),
(105, 38, 180, 'a2: dang code', 1432804942),
(106, 38, 182, 'a1: code suot ngay the', 1432805061),
(107, 38, 182, 'code gi', 1432805163),
(108, 38, 180, 'a2: c# thoi', 1432805213),
(109, 38, 180, 'chu code gia va?', 1432805239),
(110, 38, 182, 'android', 1432805274),
(111, 38, 180, 'vl', 1432805312),
(112, 38, 182, 'vai dan', 1432805388),
(113, 38, 180, 'bug khung khiep', 1432805425),
(114, 38, 180, 'met vl07.png|', 1432805989),
(115, 39, 181, 't1: moi nguoi dang lam gi?', 1432947622),
(116, 39, 181, 'ranh nc choi', 1432947647),
(117, 39, 182, 'thich thi chieu 15.png|', 1432947686),
(118, 39, 181, 'ghe von', 1432947743),
(119, 41, 181, 'chap moi nguoi', 1433084170),
(120, 41, 180, 'chao bac t1, bac a1', 1433084214),
(121, 41, 182, 'chao bac t1, chu a2', 1433084282),
(122, 41, 181, 'manh gioi ca chu 03.png|', 1433084317),
(123, 41, 180, '02.png| khoe lam bac', 1433084354),
(124, 41, 182, 'em cung khoe bac a19.png|', 1433084372),
(125, 39, 182, 'he he', 1433084524),
(126, 39, 181, 'hey good morning', 1433125320),
(127, 39, 181, 'hey', 1433125556),
(128, 39, 181, 'co ten nhom chua', 1433125915),
(129, 39, 181, 'ten nhom di', 1433125996),
(130, 39, 181, 'chac on', 1433126136),
(131, 39, 181, 'tao, khong cap nhat ne', 1433126221),
(132, 39, 181, 'okay roi day', 1433126262),
(133, 39, 181, 'chat nhom day', 1433146852);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`c_id`),
  ADD KEY `user_one` (`user_one`),
  ADD KEY `user_two` (`user_two`);

--
-- Indexes for table `conversation_reply`
--
ALTER TABLE `conversation_reply`
  ADD PRIMARY KEY (`cr_id`),
  ADD KEY `user_id_fk` (`user_id_fk`),
  ADD KEY `c_id_fk` (`c_id_fk`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`friend_one`,`friend_two`);

--
-- Indexes for table `gcm_users`
--
ALTER TABLE `gcm_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group_logged_user`
--
ALTER TABLE `group_logged_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group_reply`
--
ALTER TABLE `group_reply`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `conversation_reply`
--
ALTER TABLE `conversation_reply`
  MODIFY `cr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=324;
--
-- AUTO_INCREMENT for table `gcm_users`
--
ALTER TABLE `gcm_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;
--
-- AUTO_INCREMENT for table `group`
--
ALTER TABLE `group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT for table `group_logged_user`
--
ALTER TABLE `group_logged_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;
--
-- AUTO_INCREMENT for table `group_reply`
--
ALTER TABLE `group_reply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `fk_user_one_id` FOREIGN KEY (`user_one`) REFERENCES `gcm_users` (`id`),
  ADD CONSTRAINT `fk_user_two_id` FOREIGN KEY (`user_two`) REFERENCES `gcm_users` (`id`);

--
-- Constraints for table `conversation_reply`
--
ALTER TABLE `conversation_reply`
  ADD CONSTRAINT `fk_c_id` FOREIGN KEY (`c_id_fk`) REFERENCES `conversation` (`c_id`),
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id_fk`) REFERENCES `gcm_users` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
