-- -------------------------------------------------------------
-- TablePlus 5.6.2(516)
--
-- https://tableplus.com/
--
-- Database: cars
-- Generation Time: 2023-11-23 23:03:12.3300
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `carExtras` (
  `extra_id` int NOT NULL AUTO_INCREMENT,
  `reliability` int NOT NULL,
  `Utility` int NOT NULL,
  `economy` int NOT NULL,
  `maintenance` int NOT NULL,
  `luxury` int NOT NULL,
  `performance` int NOT NULL,
  `car_listing` int NOT NULL,
  `offroading` int DEFAULT NULL,
  PRIMARY KEY (`extra_id`),
  KEY `car_listing` (`car_listing`),
  CONSTRAINT `carextras_ibfk_1` FOREIGN KEY (`car_listing`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` text,
  `model` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `price` int DEFAULT NULL,
  `seats` int DEFAULT NULL,
  `type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `fuel` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `transmission` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `consumption` int DEFAULT NULL,
  `year` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `listing_user` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_user` (`listing_user`),
  CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`listing_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `hiring` (
  `id` int NOT NULL AUTO_INCREMENT,
  `car_id` int NOT NULL,
  `user_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `returned` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car_id` (`car_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `hiring_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  CONSTRAINT `hiring_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` text,
  `role` text,
  `password` text,
  `last_name` text,
  `first_name` text,
  `phone` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

INSERT INTO `carExtras` (`extra_id`, `reliability`, `Utility`, `economy`, `maintenance`, `luxury`, `performance`, `car_listing`, `offroading`) VALUES
(7, 9, 4, 5, 9, 7, 5, 9, 2),
(15, 6, 8, 8, 5, 7, 4, 5, 8),
(16, 7, 7, 7, 6, 3, 5, 4, 7),
(19, 5, 8, 5, 3, 4, 4, 10, 9),
(20, 8, 6, 7, 6, 6, 5, 11, 5),
(22, 5, 5, 4, 6, 9, 8, 13, 2),
(23, 6, 3, 8, 8, 7, 2, 14, 2),
(24, 7, 7, 5, 7, 7, 8, 15, 2),
(25, 4, 5, 6, 2, 6, 7, 16, 5);

INSERT INTO `cars` (`id`, `make`, `model`, `price`, `seats`, `type`, `fuel`, `transmission`, `consumption`, `year`, `image`, `listing_user`) VALUES
(4, 'Toyota', 'Rav4', 20000, 5, 'SUV', 'petrol', 'CVT', 14, '2019', '/assets/img/cars/rav4.jpeg', 1),
(5, 'Mercedes', 'G63', 85000, 7, 'SUV', 'petrol', 'Manual', 8, '2015', '/assets/img/cars/g63.jpeg', 1),
(9, 'Landrover', 'Range rover', 50000, 5, 'SUV', 'petrol', 'Automatic', 8, '2014', '/assets/img/cars/rover.jpeg', 1),
(10, 'Nissan', 'Patrol', 90000, 5, 'SUV', 'petrol', 'Automatic', 5, '2016', '/assets/img/cars/patrol.jpeg', 1),
(11, 'Toyota', 'Landcruiser Prado', 40000, 7, 'SUV', 'Diesel', 'Manual', 10, '2016', '/assets/img/cars/ToyotaBusiness Class5100000.jpeg', 1),
(13, 'Mercedes', 'c63', 90000, 5, 'Sedan', 'Petrol', 'Automatic', 7, '2018', '/assets/img/cars/c63.jpeg', 1),
(14, 'Mazda', 'Demio', 9000, 5, 'Hatchback', 'Petrol', 'Automatic', 16, '2014', '/assets/img/cars/demio.jpeg', 1),
(15, 'Bmw', '320i', 35000, 5, 'Sedan', 'Petrol', 'Automatic', 10, '2014', '/assets/img/cars/320i.jpeg', 1),
(16, 'Toyota', 'Hiace', 9000, 9, 'Van', 'Diesel', 'Manual', 8, '2012', '/assets/img/cars/hiace.png', 1);

INSERT INTO `hiring` (`id`, `car_id`, `user_id`, `start_date`, `end_date`, `returned`) VALUES
(73, 5, 1, '2023-11-25', '2023-11-29', 1),
(74, 9, 1, '2023-11-25', '2023-11-27', 1),
(75, 11, 1, '2023-11-24', '2023-11-25', 0);

INSERT INTO `users` (`id`, `username`, `role`, `password`, `last_name`, `first_name`, `phone`) VALUES
(1, 'armstrong', 'admin', '123456', 'Bright ', 'Mukonesi', '(+254) 791670105'),
(2, 'brandon', 'user', '123456', 'Brandon', 'Manyonyi', '(+254) 38503853');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;