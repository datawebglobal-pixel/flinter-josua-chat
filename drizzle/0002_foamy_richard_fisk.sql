CREATE TABLE `identityProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`identity` enum('Flinter','Josua') NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`subtitle` varchar(180) NOT NULL,
	`avatarInitial` varchar(1) NOT NULL,
	CONSTRAINT `identityProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `identityProfiles_identity_unique` UNIQUE(`identity`)
);
--> statement-breakpoint
ALTER TABLE `mediaItems` ADD `memoryIndex` int;