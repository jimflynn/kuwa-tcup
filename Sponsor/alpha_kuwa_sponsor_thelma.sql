-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 23, 2018 at 04:59 AM
-- Server version: 5.7.22
-- PHP Version: 7.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alpha_kuwa_sponsor_thelma`
--

-- --------------------------------------------------------

--
-- Table structure for table `passcode_request`
--

CREATE TABLE `passcode_request` (
  `full_name` varchar(128) DEFAULT NULL,
  `passcode` varchar(6) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sponsorship_request`
--

CREATE TABLE `sponsorship_request` (
  `sponsorship_request_id` bigint(32) NOT NULL,
  `ip` varchar(128) DEFAULT NULL,
  `contract_address` varchar(128) DEFAULT NULL,
  `client_address` varchar(128) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `application_binary_interface_id` int(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `passcode_request`
--
ALTER TABLE `passcode_request`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `sponsorship_request`
--
ALTER TABLE `sponsorship_request`
  ADD PRIMARY KEY (`sponsorship_request_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `passcode_request`
--
ALTER TABLE `passcode_request`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sponsorship_request`
--
ALTER TABLE `sponsorship_request`
  MODIFY `sponsorship_request_id` bigint(32) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
