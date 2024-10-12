CREATE TABLE `borrowing` (
	`id` varchar(21) NOT NULL,
	`userId` varchar(21) NOT NULL,
	`startTime` date NOT NULL,
	`endTime` date,
	`from` int NOT NULL,
	`to` int NOT NULL,
	`classroomId` varchar(21) NOT NULL,
	CONSTRAINT `borrowing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classroom` (
	`id` varchar(21) NOT NULL,
	`name` varchar(256) NOT NULL,
	`place` text NOT NULL,
	`description` text NOT NULL,
	`addedTime` timestamp NOT NULL,
	`updatedTime` timestamp NOT NULL,
	CONSTRAINT `classroom_id` PRIMARY KEY(`id`),
	CONSTRAINT `classroom_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `department` (
	`id` varchar(21) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`location` text NOT NULL,
	CONSTRAINT `department_id` PRIMARY KEY(`id`),
	CONSTRAINT `department_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(21) NOT NULL,
	`username` varchar(256) NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`departmentId` varchar(21) NOT NULL,
	`job` text NOT NULL,
	`extension` text NOT NULL,
	`roles` enum('Admin','Teacher') NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `borrowing` ADD CONSTRAINT `borrowing_classroomId_classroom_id_fk` FOREIGN KEY (`classroomId`) REFERENCES `classroom`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_departmentId_department_id_fk` FOREIGN KEY (`departmentId`) REFERENCES `department`(`id`) ON DELETE cascade ON UPDATE no action;