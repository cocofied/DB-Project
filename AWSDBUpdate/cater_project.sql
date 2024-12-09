-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: catering-project-db.ctq4sq260acq.us-east-2.rds.amazonaws.com    Database: catering_service
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `CateringCompany`
--

DROP TABLE IF EXISTS `CateringCompany`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CateringCompany` (
  `CompanyID` int NOT NULL AUTO_INCREMENT,
  `CompanyName` varchar(255) DEFAULT NULL,
  `ContactName` varchar(100) DEFAULT NULL,
  `ContactEmail` varchar(255) DEFAULT NULL,
  `ContactPhone` varchar(15) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CompanyID`),
  UNIQUE KEY `ContactEmail` (`ContactEmail`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CateringCompany`
--

LOCK TABLES `CateringCompany` WRITE;
/*!40000 ALTER TABLE `CateringCompany` DISABLE KEYS */;
INSERT INTO `CateringCompany` VALUES (1,'Premium Catering Co.','John Doe','contact@premiumcatering.com','1234567890','123 Main St, Cityville'),(2,'Gourmet Bites','John Smith','john@gourmetbites.com','0987654321','456 Savory Rd.'),(7,'Golden Gourmet Catering','Sarah Lee','sarah.lee@goldengourmet.com','555-1234','123 Main St, Springfield'),(8,'Elegant Events Catering','John Doe','john.doe@elegantevents.com','555-5678','456 Elm St, Springfield');
/*!40000 ALTER TABLE `CateringCompany` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CateringService`
--

DROP TABLE IF EXISTS `CateringService`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CateringService` (
  `ServiceID` int NOT NULL AUTO_INCREMENT,
  `ServiceName` varchar(255) DEFAULT NULL,
  `Description` text,
  `Price` decimal(10,2) DEFAULT NULL,
  `CompanyID` int DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  PRIMARY KEY (`ServiceID`),
  KEY `CompanyID` (`CompanyID`),
  KEY `fk_customer_service` (`CustomerID`),
  CONSTRAINT `CateringService_ibfk_1` FOREIGN KEY (`CompanyID`) REFERENCES `CateringCompany` (`CompanyID`) ON DELETE CASCADE,
  CONSTRAINT `fk_customer_service` FOREIGN KEY (`CustomerID`) REFERENCES `Customer` (`CustomerID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CateringService`
--

LOCK TABLES `CateringService` WRITE;
/*!40000 ALTER TABLE `CateringService` DISABLE KEYS */;
INSERT INTO `CateringService` VALUES (1,'Premium Catering','High-end event catering',2000.00,1,NULL),(2,'Corporate Lunch','Office lunch buffet',800.00,2,NULL),(17,'Breakfast Buffet','Breakfast buffet with assorted items',15.00,1,NULL),(18,'Lunch Buffet','Lunch buffet with various options',20.00,1,NULL),(19,'Dinner Buffet','Dinner buffet with appetizers, entrees, and desserts',25.00,1,NULL),(20,'Plated Breakfast','Plated breakfast with custom options',18.00,1,NULL),(21,'Plated Lunch','Plated lunch with personalized service',22.00,1,NULL),(22,'Plated Dinner','Plated dinner with gourmet options',30.00,1,NULL),(23,'Corporate Lunch','Office lunch catering for business events',800.00,2,NULL),(24,'Premium Catering','High-end event catering for special occasions',2000.00,2,NULL),(25,'Breakfast Buffet','Breakfast buffet with assorted items',17.00,7,NULL),(26,'Lunch Plated','Lunch plated service with personalized dishes',22.00,7,NULL),(27,'Dinner Buffet','Dinner buffet with appetizers, entrees, and desserts',30.00,8,NULL),(28,'Plated Dinner','Plated dinner with gourmet options',35.00,8,NULL);
/*!40000 ALTER TABLE `CateringService` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customer`
--

DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customer` (
  `CustomerID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`CustomerID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Customer_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customer`
--

LOCK TABLES `Customer` WRITE;
/*!40000 ALTER TABLE `Customer` DISABLE KEYS */;
INSERT INTO `Customer` VALUES (1,'Alice','Brown','alice.brown@email.com','1112223333','789 Tasty Ave.',1),(2,'Bob','Green','bob.green@email.com','4445556666','101 Delicious Ln.',2);
/*!40000 ALTER TABLE `Customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment` (
  `PaymentID` int NOT NULL AUTO_INCREMENT,
  `PaymentDate` date DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PaymentMethod` enum('CreditCard','DebitCard','PayPal','Cash') DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  `ServiceID` int DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `ServiceID` (`ServiceID`),
  CONSTRAINT `Payment_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `Customer` (`CustomerID`) ON DELETE CASCADE,
  CONSTRAINT `Payment_ibfk_2` FOREIGN KEY (`ServiceID`) REFERENCES `CateringService` (`ServiceID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
INSERT INTO `Payment` VALUES (2,'2024-12-02',800.00,'PayPal',2,2),(5,'2024-12-01',2000.00,'CreditCard',1,1);
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ServiceReview`
--

DROP TABLE IF EXISTS `ServiceReview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ServiceReview` (
  `ReviewID` int NOT NULL AUTO_INCREMENT,
  `ReviewDate` date DEFAULT NULL,
  `Rating` int DEFAULT NULL,
  `Comments` text,
  `CustomerID` int DEFAULT NULL,
  `ServiceID` int DEFAULT NULL,
  PRIMARY KEY (`ReviewID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `ServiceID` (`ServiceID`),
  CONSTRAINT `ServiceReview_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `Customer` (`CustomerID`) ON DELETE CASCADE,
  CONSTRAINT `ServiceReview_ibfk_2` FOREIGN KEY (`ServiceID`) REFERENCES `CateringService` (`ServiceID`) ON DELETE CASCADE,
  CONSTRAINT `ServiceReview_chk_1` CHECK (((`Rating` >= 1) and (`Rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ServiceReview`
--

LOCK TABLES `ServiceReview` WRITE;
/*!40000 ALTER TABLE `ServiceReview` DISABLE KEYS */;
INSERT INTO `ServiceReview` VALUES (2,'2024-12-02',4,'Very good but a bit delayed.',2,2),(3,'2024-12-01',5,'Excellent service, prompt delivery.',1,1);
/*!40000 ALTER TABLE `ServiceReview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'alice_brown','hashed_password_1','alice.brown@email.com','2024-12-01 19:57:45'),(2,'bob_green','hashed_password_2','bob.green@email.com','2024-12-01 19:57:45');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-06  8:39:09
