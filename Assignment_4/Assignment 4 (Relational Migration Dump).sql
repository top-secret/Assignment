CREATE TABLE `Vehicle` (
  `id` int PRIMARY KEY,
  `person_id` int,
  `model` varchar(255),
  `plate_number` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `Drive` (
  `id` int PRIMARY KEY,
  `person_id` int,
  `vehicle_id` int,
  `drive_date` timestamp,
  `distance` float,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `Person` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `Student` (
  `id` int PRIMARY KEY,
  `person_id` int,
  `student_number` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `Professor` (
  `id` int PRIMARY KEY,
  `person_id` int,
  `salary` float,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `Address` (
  `id` int PRIMARY KEY,
  `person_id` int,
  `street` varchar(255),
  `city` varchar(255),
  `state` varchar(255),
  `country` varchar(255),
  `zipcode` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

ALTER TABLE `Vehicle` ADD FOREIGN KEY (`person_id`) REFERENCES `Person` (`id`);

ALTER TABLE `Drive` ADD FOREIGN KEY (`person_id`) REFERENCES `Person` (`id`);

ALTER TABLE `Drive` ADD FOREIGN KEY (`vehicle_id`) REFERENCES `Vehicle` (`id`);

ALTER TABLE `Student` ADD FOREIGN KEY (`person_id`) REFERENCES `Person` (`id`);

ALTER TABLE `Professor` ADD FOREIGN KEY (`person_id`) REFERENCES `Person` (`id`);

ALTER TABLE `Address` ADD FOREIGN KEY (`person_id`) REFERENCES `Person` (`id`);
