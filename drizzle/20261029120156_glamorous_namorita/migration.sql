CREATE TABLE `todos_table` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`title` varchar(255) NOT NULL,
	`completed` boolean NOT NULL,
	`createdAt` timestamp NOT NULL
);
