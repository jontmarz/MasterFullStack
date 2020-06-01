CREATE TABLE `USERS` (
	`id` int(255) NOT NULL AUTO_INCREMENT,
	`name` varchar(50) NOT NULL,
	`subname` varchar(100) NOT NULL,
	`role` varchar(20),
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`description` TEXT,
	`image` varchar(255),
	`create_at` DATETIME NOT NULL,
	`update_at` DATETIME NOT NULL,
	`remember_token` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
)ENGINE=InnoDB;;

CREATE TABLE `CATEGORIES` (
	`id` int(255) NOT NULL AUTO_INCREMENT,
	`name` varchar(100) NOT NULL,
	`create_at` DATETIME NOT NULL,
	`update_at` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
)ENGINE=InnoDB;;

CREATE TABLE `POST` (
	`id` int(255) NOT NULL AUTO_INCREMENT,
	`user_id` int(255) NOT NULL,
	`category_id` int(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` varchar(255) NOT NULL,
	`image` varchar(255),
	`create_at` DATETIME NOT NULL,
	`update_at` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
)ENGINE=InnoDB;;

ALTER TABLE `POST` ADD CONSTRAINT `POST_fk0` FOREIGN KEY (`user_id`) REFERENCES `USERS`(`id`);

ALTER TABLE `POST` ADD CONSTRAINT `POST_fk1` FOREIGN KEY (`category_id`) REFERENCES `CATEGORIES`(`id`);

