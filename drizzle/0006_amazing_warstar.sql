CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(255) NOT NULL,
	`entityType` varchar(100),
	`entityId` int,
	`details` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`caption` varchar(255),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `appointments` ADD `source` varchar(100);--> statement-breakpoint
ALTER TABLE `appointments` ADD `utmSource` varchar(100);--> statement-breakpoint
ALTER TABLE `appointments` ADD `utmMedium` varchar(100);--> statement-breakpoint
ALTER TABLE `appointments` ADD `utmCampaign` varchar(100);--> statement-breakpoint
ALTER TABLE `appointments` ADD `referrer` text;--> statement-breakpoint
ALTER TABLE `contacts` ADD `utmSource` varchar(100);--> statement-breakpoint
ALTER TABLE `contacts` ADD `utmMedium` varchar(100);--> statement-breakpoint
ALTER TABLE `contacts` ADD `utmCampaign` varchar(100);--> statement-breakpoint
ALTER TABLE `contacts` ADD `referrer` text;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;