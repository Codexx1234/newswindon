CREATE TABLE `content_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`page` varchar(50) NOT NULL,
	`section` varchar(50) NOT NULL,
	`label` varchar(255) NOT NULL,
	`defaultValue` text NOT NULL,
	`value` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_blocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `content_blocks_key_unique` UNIQUE(`key`)
);
