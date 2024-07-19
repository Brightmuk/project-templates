-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: pharmacy
-- Generation Time: 2024-07-19 08:47:17.9890
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `flower_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `flower_id` (`flower_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`flower_id`) REFERENCES `records` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` text,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `rating` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `listing_user` int DEFAULT NULL,
  `color` text NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `listing_user` (`listing_user`),
  CONSTRAINT `records_ibfk_1` FOREIGN KEY (`listing_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` text,
  `role` text,
  `password` text,
  `last_name` text,
  `first_name` text,
  `phone` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `records` (`id`, `type`, `name`, `price`, `quantity`, `rating`, `image`, `listing_user`, `color`, `description`) VALUES
(55, 'Supplements', 'Zinc Mineral Tablets', 3000, 22, ' 0 ', '/assets/img/ZincMineralTabletsAce.jpeg', 1, 'Ace', 'Zinc pills are a supplement that contains zinc. This nutrient is present in your body to help your immune system and metabolism function. Zinc pills treat Wilsons disease and low zinc levels in your body'),
(56, 'Beauty & Skin Care', 'Cerave Moisturizer', 3200, 34, ' 0 ', '/assets/img/CeraveMoisturizerAce.jpeg', 1, 'Ace', 'Developed with dermatologists, the rich formula of the CeraVe Moisturising Cream helps to protect the skins natural barrier with three essential ceramides and MVE technology to provide daily instant and long-lasting hydration'),
(57, 'Medicines', 'Brufen', 30, 100, ' 0 ', '/assets/img/BrufenAce.jpeg', 1, 'Ace', 'Pain Killers'),
(58, 'Supplements', 'Omega 3 Fish Oil Tablets', 3500, 100, ' 0 ', '/assets/img/Omega3FishOilTabletsAce.jpeg', 1, 'Ace', 'Omega-3 fatty acids are healthy fats that may support your heart health. One key benefit is helping to lower your triglycerides.'),
(59, 'Medicines', 'Eye Drops Relief', 398, 20, ' 0 ', '/assets/img/EyeDropsReliefAnusol.jpeg', 1, 'Anusol', 'Eye drops for allergies and dry eyes'),
(60, 'Medicines', 'Cetamol', 55, 500, ' 0 ', '/assets/img/CetamolAnusol.jpeg', 1, 'Anusol', 'Cetamol 650mg Tablet helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain'),
(61, 'Medicines', 'Menthoplus Rubbing oil', 300, 78, ' 0 ', '/assets/img/MenthoplusRubbingoilAce.jpeg', 1, 'Ace', 'Tablet helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain. It is used to treat headaches, migraine, toothaches, sore throats, period (menstrual) pains, arthritis, muscle aches, and the common cold.'),
(62, 'Beauty & Skin Care', 'Vitamin C serum', 797, 78, ' 0 ', '/assets/img/VitaminCserumAdol.jpeg', 1, 'Adol', 'Vitamin C serum is used to treat headaches, migraine, toothaches, sore throats, period (menstrual) pains, arthritis, muscle aches, and the common cold.'),
(63, 'Medicines', 'Strepsils Lousanges', 35, 22, ' 0 ', '/assets/img/StrepsilsLousangesAce.jpeg', 1, 'Ace', 'Strepsils is a pain and relief medicine used to relief sore throat. 3 tablets a day for severe symptoms');

INSERT INTO `users` (`id`, `username`, `role`, `password`, `last_name`, `first_name`, `phone`) VALUES
(1, 'brightmuk', 'admin', '123456', 'Bright ', 'Mukonesi', '(+254) 791670105'),
(2, 'joy', 'user', '123456', 'Joy', 'll', '(+254) 38503853');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;