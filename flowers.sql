-- -------------------------------------------------------------
-- TablePlus 5.6.2(516)
--
-- https://tableplus.com/
--
-- Database: flowers
-- Generation Time: 2023-11-22 23:17:42.1940
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `flowers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` text,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `rating` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `listing_user` int DEFAULT NULL,
  `color` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_user` (`listing_user`),
  CONSTRAINT `flowers_ibfk_1` FOREIGN KEY (`listing_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `flower_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `flower_id` (`flower_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`flower_id`) REFERENCES `flowers` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery` tinyint(1) DEFAULT NULL,
  `price` int NOT NULL,
  `status` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` text,
  `role` text,
  `password` text,
  `last_name` text,
  `first_name` text,
  `phone` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

INSERT INTO `flowers` (`id`, `type`, `name`, `price`, `quantity`, `rating`, `image`, `listing_user`, `color`) VALUES
(4, 'Hamper', 'Make it happen', 20000, 14, '4.7', '/assets/img/cars/choco-flower.jpeg', 1, 'Red'),
(9, 'Romantic', 'The opulence', 3500, 11, '4.8', '/assets/img/cars/mixed-flower1.png', 1, 'Mixed'),
(13, 'Romantic', 'Beautiful day roses', 1900, 10, '4.6', '/assets/img/cars/mixed.jpeg', 1, 'Red-white'),
(15, 'Plant', 'Love on first signt', 4500, 5, '4.2', '/assets/img/cars/red-white1.png', 1, 'Red-yellow'),
(26, 'Bouquet', 'Truly yours forever', 3200, 8, '4.2', '/assets/img/cars/mixed-white1.png', 1, 'Mixed'),
(27, 'Hamper', 'Romantic choco bouquet', 2300, 3, '3.9', '/assets/img/cars/hand-flower1.png', 1, 'White'),
(28, 'Bouquet', 'The Serena X peach', 4000, 3, '4.5', '/assets/img/cars/flower-greyed.jpeg', 1, 'Yellow'),
(30, 'Hamper', 'The Romantic gesture', 3000, 14, '4.6', '/assets/img/cars/Red-roses.png', 1, 'Red'),
(31, 'Bouquet', 'Antique of love', 25000, 5, '4.6', '/assets/img/flowers/imagered.png', 1, 'Red'),
(32, 'Bouquet', 'Pin Summer Roses', 3700, 16, ' 0 ', '/assets/img/flowers/imagered.jpeg', 1, 'red');

INSERT INTO `order_items` (`id`, `order_id`, `flower_id`) VALUES
(11, 861, 9),
(12, 861, 13),
(13, 407, 30),
(14, 957, 15),
(15, 957, 30),
(16, 827, 31),
(17, 827, 28),
(18, 827, 26),
(19, 212, 31),
(20, 212, 30),
(21, 315, 13),
(22, 315, 4),
(23, 250, 13),
(24, 250, 26),
(25, 205, 9),
(26, 526, 9);

INSERT INTO `orders` (`id`, `user_id`, `date`, `delivery`, `price`, `status`) VALUES
(205, 1, '2023-11-21 14:08:45', 1, 3500, ' submitted '),
(212, 1, '2023-11-21 14:00:27', 1, 28000, ' submitted '),
(250, 1, '2023-11-21 14:06:15', 1, 5100, ' submitted '),
(315, 1, '2023-11-21 14:01:54', 1, 21900, ' submitted '),
(407, 1, '2023-11-21 13:19:41', 1, 3000, 'fulfilled'),
(526, 1, '2023-11-21 14:09:50', 1, 3500, ' submitted '),
(827, 1, '2023-11-21 13:58:06', 1, 32200, ' submitted '),
(861, 1, '2023-11-20 23:56:06', 1, 3900, 'fulfilled'),
(957, 1, '2023-11-21 13:25:02', 1, 7500, ' submitted ');

INSERT INTO `users` (`id`, `username`, `role`, `password`, `last_name`, `first_name`, `phone`) VALUES
(1, 'brightmuk', 'admin', '123456', 'Bright ', 'Mukonesi', '(+254) 791670105'),
(2, 'brandon', 'user', '123456', 'Brandon', 'Manyonyi', '(+254) 38503853');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;