CREATE TABLE `class_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`classId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `class_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`levelId` int NOT NULL,
	`classDate` date NOT NULL,
	`videoUrl` text,
	`videoKey` varchar(255),
	`homeworkPdfUrl` text,
	`homeworkPdfKey` varchar(255),
	`homeworkDescription` text,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `homework_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`homeworkId` int,
	`classId` int,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `homework_completions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `homeworks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`levelId` int NOT NULL,
	`dueDate` date,
	`pdfUrl` text,
	`pdfKey` varchar(255),
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `homeworks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `levels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`color` varchar(20) DEFAULT '#1a6b6b',
	`displayOrder` int DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `levels_id` PRIMARY KEY(`id`),
	CONSTRAINT `levels_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`username` varchar(100) NOT NULL,
	`passwordPlain` varchar(100) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`levelId` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastLogin` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
DROP TABLE `admin_users`;--> statement-breakpoint
DROP TABLE `contact_responses`;--> statement-breakpoint
ALTER TABLE `contacts` DROP COLUMN `assignedTo`;