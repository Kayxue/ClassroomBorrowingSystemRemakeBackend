CREATE TABLE `borrowing` (
	`id` varchar(48) NOT NULL DEFAULT ('UUID()'),
	`userId` varchar(48) NOT NULL,
	`startTime` date NOT NULL,
	`endTime` date,
	`from` int NOT NULL,
	`to` int NOT NULL,
	`classroomId` varchar(48) NOT NULL,
	CONSTRAINT `borrowing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classroom` (
	`id` varchar(48) NOT NULL DEFAULT ('UUID()'),
	`name` varchar(256) NOT NULL,
	`place` text NOT NULL,
	`description` text NOT NULL,
	`addedTime` timestamp NOT NULL,
	`updatedTime` timestamp NOT NULL,
	CONSTRAINT `classroom_id` PRIMARY KEY(`id`),
	CONSTRAINT `classroom_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(48) NOT NULL,
	`username` varchar(256) NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`department` text NOT NULL,
	`extension` text NOT NULL,
	`roles` enum('Admin','Teacher') NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_classroomId_classroom_id_fk` FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`id`) ON DELETE cascade ON UPDATE no action;