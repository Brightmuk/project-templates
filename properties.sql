-- -------------------------------------------------------------
-- TablePlus 5.6.2(516)
--
-- https://tableplus.com/
--
-- Database: hotel
-- Generation Time: 2024-02-14 17:14:57.7130
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `category` (
  `name` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `price` int NOT NULL,
  `img` varchar(50) NOT NULL,
  `dec` varchar(300) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `location` varchar(20) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `lister` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `lister` (`lister`),
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`lister`) REFERENCES `user` (`name`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;;

CREATE TABLE `requests` (
  `property` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `lister` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `requester` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  KEY `property` (`property`),
  KEY `lister` (`lister`),
  CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`property`) REFERENCES `category` (`name`),
  CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`lister`) REFERENCES `user` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `user` (
  `name` varchar(20) NOT NULL,
  `email` varchar(40) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `password` varchar(300) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;;

INSERT INTO `category` (`name`, `type`, `price`, `img`, `dec`, `location`, `category`, `lister`) VALUES
('46 Residency', 'For Rent', 35000, '/assets/img/rooms/For Rentimg.png', 'An apartment at 46 stage, with new amenities such as swimming pool and elevator', 'Kawangware', 'Apartment', 'PAC inc'),
('54', 'For Sale', 800000, '/assets/img/rooms/For Saleimg.png', 'Adjacent to kiriri primary in ndeiya thigio\r\n300 metres from kiriri police post\r\n20 mins drive from kikuyu\r\nScenic view\r\nwater and electricity on site\r\nAll weather roads', 'Utawala', 'Land', 'PAC inc'),
('Amani Garden', 'For Rent', 34000, '/assets/img/rooms/room4.jpg', 'Amaini Garden is one of the best developments in Kaimbu. It has furnished and clean units.It has furnished and clean units', 'Ruai', 'Apartment', 'PAC inc'),
('Autolux view', 'For Rent', 15000, '/assets/img/rooms/room6.jpg', 'Glass view	For Rent	10000	1	/assets/img/rooms/room5.jpg	modern built one and two bedroom in Kabiria,easy access to the road ,2min walk to the market,parking available ,own ', 'Runda', 'Apartment', 'James Onyango'),
('Glass view', 'For Rent', 45000, '/assets/img/rooms/room7.jpg', 'New built one and two bedroom in Kabiria,easy access to the road ,2min walk to the market,parking available ,own water meter tokens,several school are around the area including the best performing school like Kahuho Road Academy & Lepic School.', 'Runda', 'Apartment', 'PAC inc'),
('Macha Acres', 'For Sale', 750000, '/assets/img/rooms/For Saleimg.png', '47 parcels of 1/8-acre plots in a cluster of 53, located 2 km from Mombasa highway. The plots are within 800 meters of Malili township. Each plot has a ready title deed.', 'Ruiru', 'Land', 'PAC inc'),
('Membly', 'For Rent', 10000, '/assets/img/rooms/room5.jpg', 'Modern built one and two bedroom in Kabiria,easy access to the road ,2min walk to the market,parking available ,own water meter tokens,several ', 'Runda', 'Apartment', 'PAC inc'),
('Renyd\'s', 'For Sale', 5000000, '/assets/img/rooms/room2.jpg', 'Welcome to the Exceptional Leshwa House 1 - Your Gateway to Luxurious Living in Kileleshwa!Discover a residential complex strategically positioned in the very heart of Kileleshwa on Othaya Road, where the promise of comfortable and opulent living comes to life', 'Kitisuru', 'House', 'Diana Realtor'),
('Runda Gate', 'For Rent', 45000, '/assets/img/rooms/room1.jpg', 'ONGOING CONSTRUCTION DEVELOPMENTExpected Completion Date: MARCH 2025Introducing Alina Harbour Apartments: located along Kirichwa Road, Off Argwings Kodhek Road in Kilimani, Nairobi. ', 'Kileleshwa', 'Apartment', 'PAC inc'),
('Wt Highrise', 'For Sale', 43000000, '/assets/img/rooms/For Saleimg.png', 'Location: Watamu\r\nTitle Deed: Available\r\nBedrooms: 4, all with ensuite bathrooms\r\nAir Conditioning: In all rooms\r\nVentilation: Fans installed\r\n', 'Kileleshwa', 'House', 'PAC inc');

INSERT INTO `requests` (`property`, `lister`, `requester`) VALUES
('Glass view', 'PAC inc', 'be.rightmuk@gmail.com');

INSERT INTO `user` (`name`, `email`, `phone`, `password`) VALUES
('Diana Realtor', 'diananzile@gmail.com', '0743042318', '4120'),
('James Onyango', 'james@gmail.com', '0791670103', '123456'),
('PAC inc', 'be.rightmuk@gmail.com', '0791670106', '123456');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;