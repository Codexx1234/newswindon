CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` enum('super_admin','admin','editor') NOT NULL DEFAULT 'admin',
	`isActive` boolean NOT NULL DEFAULT true,
	`lastLogin` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `contact_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`adminUserId` int,
	`responseType` enum('email','whatsapp','phone','note') NOT NULL DEFAULT 'note',
	`subject` varchar(255),
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contacts` MODIFY COLUMN `status` enum('nuevo','contactado','en_proceso','cerrado','no_interesado') NOT NULL DEFAULT 'nuevo';--> statement-breakpoint
ALTER TABLE `contacts` ADD `employeeCount` varchar(50);--> statement-breakpoint
ALTER TABLE `contacts` ADD `source` varchar(100) DEFAULT 'website';--> statement-breakpoint
ALTER TABLE `contacts` ADD `assignedTo` int;--> statement-breakpoint
ALTER TABLE `contacts` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `contacts` ADD `lastContactedAt` timestamp;