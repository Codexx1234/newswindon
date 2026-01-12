CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`appointmentDate` timestamp NOT NULL,
	`appointmentType` enum('entrevista_nivel','consulta_general','empresa') NOT NULL DEFAULT 'entrevista_nivel',
	`status` enum('pendiente','confirmada','cancelada','completada') NOT NULL DEFAULT 'pendiente',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`pageViews` int NOT NULL DEFAULT 0,
	`contactSubmissions` int NOT NULL DEFAULT 0,
	`appointmentBookings` int NOT NULL DEFAULT 0,
	`chatbotInteractions` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `daily_metrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_metrics_date_unique` UNIQUE(`date`)
);
