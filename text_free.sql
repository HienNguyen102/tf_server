-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 18, 2017 at 05:24 AM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ProG` (IN `user_id` INT(11))  SELECT * FROM `user` WHERE id = user_id$$

DELIMITER ;

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

-- --------------------------------------------------------

--
-- Table structure for table `logged_in_user`
--

CREATE TABLE `logged_in_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `logged_in_user`
--

INSERT INTO `logged_in_user` (`id`, `user_id`, `room_id`) VALUES
(12, 194, 5),
(13, 195, 5),
(14, 194, 6),
(15, 196, 6),
(18, 194, 8),
(19, 198, 8),
(20, 194, 9),
(21, 199, 9),
(22, 194, 10),
(23, 197, 10),
(24, 195, 11),
(25, 196, 11),
(26, 195, 12),
(27, 196, 12),
(28, 194, 12),
(31, 194, 15),
(32, 195, 15),
(33, 197, 15);

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `text` text COLLATE utf8_bin NOT NULL,
  `time_stamp` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `room_id`, `user_id`, `to_user_id`, `text`, `time_stamp`) VALUES
(3, 5, 194, 195, 'Helo 195', 2147483647),
(4, 5, 195, 194, 'Helo 194', 2147483647),
(5, 6, 194, 196, 'Helo 196', 2147483647),
(6, 8, 194, 198, 'Helo 198', 2147483647),
(7, 8, 198, 194, 'Helo 194', 2147483647),
(8, 8, 198, 194, 'Ban dang lam gi 194', 2147483647),
(9, 9, 194, 199, 'Chao 199', 2147483647),
(10, 6, 196, 194, 'Chao 194', 2147483647),
(11, 10, 194, 197, 'Chao 197', 2147483647),
(12, 9, 194, 199, '199 Dang lam gi day', 2147483647),
(13, 9, 194, 199, '199 Ne', 2147483647),
(14, 11, 195, 196, 'Hi 196', 2147483647),
(15, 11, 195, 196, 'Hi hi 196', 2147483647),
(16, 12, 195, 197, 'Hi 197', 1489245873639),
(17, 12, 195, 197, '197 Ne', 1489245928696),
(18, 12, 197, 195, 'Chao em 195', 1489293810587),
(19, 6, 196, 194, 'chu 96 dang lam gi', 1489306974593),
(20, 6, 196, 194, 'ưng hoàng phục', 1489307021190),
(21, 6, 194, 196, 'jj', 1489315142292),
(22, 6, 194, 196, 'chao', 1489317203042),
(23, 6, 194, 196, 'ai mua trang', 1489317233090),
(24, 6, 194, 196, 'hi', 1489318038680),
(25, 6, 194, 196, 'Hola', 1489318124433),
(26, 6, 194, 196, 'Hola2', 1489318349913);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `name` varchar(300) COLLATE utf8_bin NOT NULL,
  `created_by` int(11) NOT NULL,
  `latest_message` text COLLATE utf8_bin NOT NULL,
  `latest_time` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `name`, `created_by`, `latest_message`, `latest_time`) VALUES
(5, '194_195', 194, 'Helo 194', 0),
(6, '194_196', 194, 'Hola2', 1489318349913),
(8, '194_198', 194, 'Ban dang lam gi 194', 0),
(9, '194_199', 194, '197 Ne', 2147483647),
(10, '194_197', 194, 'Chao 197', 2147483647),
(11, '195_196', 195, 'Hi hi 196', 1489245735335),
(12, '195_197', 195, 'Chao em 195', 1489293810587),
(15, 'room nhau chieu thu 7', 194, '195 change group name to room nhau chieu thu 7', 1489810206152);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `socket_id` varchar(100) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(20) NOT NULL,
  `email` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isOnline` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `socket_id`, `name`, `username`, `password`, `email`, `created_at`, `isOnline`) VALUES
(194, 'Qr34kFctNxKPSiE-AAAG', '', 'hienAndroid', '123', 'hienAndroid@gmail.com', '2017-03-02 08:36:04', 1),
(195, 'NcJ9BcLTo-nwEJ1SAAAS', '', 'hienAndroid2', '123', 'hien2@gmail.com', '2017-03-02 09:48:55', 0),
(196, '', '', 'gonto', 'gonto', 'gongo@gmail.com', '2017-03-02 13:56:15', 0),
(197, NULL, '', 'hien3', '123', 'hien3@gmail.com', '2017-03-04 11:28:10', 0),
(198, NULL, '', 'hien4', '124', 'hien4@gmail.com', '2017-03-04 11:30:02', 0),
(199, NULL, '', 'hien5', '123', 'hien4@gmail.com', '2017-03-09 16:23:31', 0);

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
-- Indexes for table `logged_in_user`
--
ALTER TABLE `logged_in_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_us_id` (`user_id`),
  ADD KEY `fk_room_id` (`room_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_message` (`user_id`),
  ADD KEY `fk_room_message` (`room_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id_created_room` (`created_by`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
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
  MODIFY `cr_id` int(11) NOT NULL AUTO_INCREMENT;
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
-- AUTO_INCREMENT for table `logged_in_user`
--
ALTER TABLE `logged_in_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `fk_user_one_id` FOREIGN KEY (`user_one`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `fk_user_two_id` FOREIGN KEY (`user_two`) REFERENCES `user` (`id`);

--
-- Constraints for table `conversation_reply`
--
ALTER TABLE `conversation_reply`
  ADD CONSTRAINT `fk_c_id` FOREIGN KEY (`c_id_fk`) REFERENCES `conversation` (`c_id`),
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id_fk`) REFERENCES `user` (`id`);

--
-- Constraints for table `logged_in_user`
--
ALTER TABLE `logged_in_user`
  ADD CONSTRAINT `fk_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `fk_us_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `fk_room_message` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `fk_user_message` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `fk_user_id_created_room` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
