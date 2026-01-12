ALTER TABLE `appointments` ADD `reminderSent` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `daily_metrics` ADD `whatsappClicks` int DEFAULT 0 NOT NULL;