-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: webdaugia
-- ------------------------------------------------------
-- Server version	5.7.22-0ubuntu18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bid`
--

DROP TABLE IF EXISTS `bid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bid` (
  `username` varchar(32) NOT NULL,
  `proID` int(11) NOT NULL,
  `maxPrice` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bid_username_proID_pk` (`username`,`proID`),
  KEY `bid_products_proID_fk` (`proID`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid`
--

LOCK TABLES `bid` WRITE;
/*!40000 ALTER TABLE `bid` DISABLE KEYS */;
/*!40000 ALTER TABLE `bid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bidlog`
--

DROP TABLE IF EXISTS `bidlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bidlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `proID` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `price` int(11) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bidlog_proID_username_price_pk` (`proID`,`username`,`price`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bidlog`
--

LOCK TABLES `bidlog` WRITE;
/*!40000 ALTER TABLE `bidlog` DISABLE KEYS */;
INSERT INTO `bidlog` VALUES (1,1,'2',3,'2018-06-19 18:43:23','2018-06-19 18:43:23');
/*!40000 ALTER TABLE `bidlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `catID` int(11) NOT NULL AUTO_INCREMENT,
  `catName` varchar(256) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`catID`),
  UNIQUE KEY `categories_name_uindex` (`catName`),
  UNIQUE KEY `name` (`catName`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Quần Áo','2018-06-01 13:11:23','2018-06-01 13:11:23'),(2,'Linh Kiện Điện Tử','2018-06-01 13:11:23','2018-06-01 13:11:23'),(3,'Linh Kiện Điện Thoại','2018-06-01 13:11:23','2018-06-01 13:11:23'),(4,'Linh Kiện Máy Tính','2018-06-01 13:11:23','2018-06-01 13:11:23'),(6,'Quà Lưu Niệm','2018-06-01 13:11:23','2018-06-01 13:11:23'),(7,'Tập Vở','2018-06-01 06:17:33','2018-06-01 06:23:29'),(9,'Mỹ Phẩm','2018-06-02 06:36:29','2018-06-20 11:36:43');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gainvip_request`
--

DROP TABLE IF EXISTS `gainvip_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gainvip_request` (
  `username` varchar(32) NOT NULL,
  `isAccepted` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`),
  UNIQUE KEY `gainvip_request_username_uindex` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gainvip_request`
--

LOCK TABLES `gainvip_request` WRITE;
/*!40000 ALTER TABLE `gainvip_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `gainvip_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kickout`
--

DROP TABLE IF EXISTS `kickout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kickout` (
  `proID` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`proID`,`username`),
  KEY `kickout_user_username_fk` (`username`),
  KEY `kickout_proID_index` (`proID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kickout`
--

LOCK TABLES `kickout` WRITE;
/*!40000 ALTER TABLE `kickout` DISABLE KEYS */;
/*!40000 ALTER TABLE `kickout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `proID` int(11) NOT NULL AUTO_INCREMENT,
  `proName` varchar(255) NOT NULL,
  `username` varchar(32) NOT NULL,
  `catID` varchar(255) NOT NULL,
  `initPrice` int(11) NOT NULL,
  `stepPrice` int(11) NOT NULL,
  `shotPrice` int(11) DEFAULT NULL,
  `currentPrice` int(11) DEFAULT NULL,
  `description` text NOT NULL,
  `autoRenewal` tinyint(1) NOT NULL DEFAULT '0',
  `remainTime` datetime NOT NULL,
  `bidCount` int(11) NOT NULL DEFAULT '0',
  `isTimeOut` tinyint(1) NOT NULL DEFAULT '0',
  `maxBidder` varchar(32) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`proID`),
  KEY `products_categories_catID_fk` (`catID`),
  KEY `products_user_username_fk` (`maxBidder`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timenew`
--

DROP TABLE IF EXISTS `timenew`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timenew` (
  `timenew` int(11) NOT NULL COMMENT 'minute',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`timenew`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timenew`
--

LOCK TABLES `timenew` WRITE;
/*!40000 ALTER TABLE `timenew` DISABLE KEYS */;
/*!40000 ALTER TABLE `timenew` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(32) NOT NULL,
  `password` text NOT NULL,
  `email` varchar(127) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `point` int(11) NOT NULL DEFAULT '0',
  `gainvipAt` datetime DEFAULT NULL,
  `isValidated` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`),
  UNIQUE KEY `user_email_uindex` (`email`),
  UNIQUE KEY `user_username_uindex` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('pxq','e10adc3949ba59abbe56e057f20f883e','kitokip@gmail.com','12212322',0,NULL,0,'2018-06-20 16:40:11','2018-06-20 16:40:11'),('px','934b535800b1cba8f96a5d72f72f1611','hoaiduc.khtn@gmail.com','01110',0,NULL,0,'2018-06-02 13:20:29','2018-06-20 07:06:07'),('afk','32b42517ebd4896acf2baafbdd5aa7fd','pax.artics@gmail.com','011110',0,'2018-06-20 05:37:28',1,'2018-06-04 00:56:18','2018-06-20 05:37:28'),('pxqx','e10adc3949ba59abbe56e057f20f883e','kito@gmail.com','12212322',0,NULL,0,'2018-06-20 16:40:20','2018-06-20 16:49:19');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_evaluate`
--

DROP TABLE IF EXISTS `user_evaluate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_evaluate` (
  `fromUser` varchar(32) NOT NULL,
  `toUser` varchar(32) NOT NULL,
  `action` int(11) NOT NULL,
  `message` varchar(256) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`toUser`,`fromUser`,`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_evaluate`
--

LOCK TABLES `user_evaluate` WRITE;
/*!40000 ALTER TABLE `user_evaluate` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_evaluate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_validate`
--

DROP TABLE IF EXISTS `user_validate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_validate` (
  `username` varchar(32) NOT NULL,
  `token` varchar(256) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_validate`
--

LOCK TABLES `user_validate` WRITE;
/*!40000 ALTER TABLE `user_validate` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_validate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watchlist`
--

DROP TABLE IF EXISTS `watchlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `watchlist` (
  `proID` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`proID`,`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchlist`
--

LOCK TABLES `watchlist` WRITE;
/*!40000 ALTER TABLE `watchlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `watchlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-21 10:13:56
