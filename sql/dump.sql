-- ============================================================
-- CAR MARKETPLACE DATABASE SCHEMA
-- Supports: et, en, ru languages
-- All translatable lookup values use the unified translations table.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- UNIFIED TRANSLATIONS TABLE
-- Replaces: fuel_type_translations, transmission_translations,
--           drive_type_translations, color_translations,
--           vehicle_category_translations, body_type_translations
-- category values: 'fuel_type' | 'transmission' | 'drive_type' | 'color'
--                  | 'vehicle_category' | 'body_type' | 'emission_standard'
--                  | 'feature_category' | 'car_feature'
--                  | 'country' | 'location'
-- ref_id: the id of the record in the corresponding lookup table
-- ============================================================
CREATE TABLE translations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category    VARCHAR(50) NOT NULL,
    ref_id      INT UNSIGNED NOT NULL,
    language_code CHAR(2) NOT NULL,  -- 'et', 'en', 'ru'
    name        VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_translation (category, ref_id, language_code),
    INDEX idx_lookup (category, ref_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- LOOKUP / REFERENCE TABLES
-- ============================================================

-- Fuel types (IDs match auto24 source)
CREATE TABLE fuel_types (
    id            INT UNSIGNED PRIMARY KEY,
    technical_name VARCHAR(50) NOT NULL UNIQUE,
    is_electric   TINYINT(1) DEFAULT 0,
    is_hybrid     TINYINT(1) DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gearbox / transmission types
CREATE TABLE transmissions (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technical_name VARCHAR(50) NOT NULL UNIQUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drive type (FWD / RWD / AWD)
CREATE TABLE drive_types (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technical_name VARCHAR(50) NOT NULL UNIQUE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paint colors
CREATE TABLE colors (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technical_name VARCHAR(50) NOT NULL UNIQUE,
    hex_code      CHAR(7) DEFAULT NULL,  -- e.g. '#1a1a1a' for frontend swatches
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Emission standards (Euro 1–6d, etc.)
CREATE TABLE emission_standards (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technical_name VARCHAR(20) NOT NULL UNIQUE,  -- e.g. 'euro6d', 'euro5'
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vehicle categories (sõiduauto, maastur, mototehnika…)
CREATE TABLE vehicle_categories (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technical_name VARCHAR(50) NOT NULL UNIQUE,  -- e.g. 'car', 'suv', 'van', 'motorcycle'
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Body types (linked to parent category; IDs match auto24 data-values)
CREATE TABLE body_types (
    id            INT UNSIGNED PRIMARY KEY,  -- explicit auto24 ID (1, 2, 61…)
    category_id   INT UNSIGNED NOT NULL,
    technical_name VARCHAR(50) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES vehicle_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_tech_name (category_id, technical_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Countries (import origin / registration country; IDs match auto24)
CREATE TABLE countries (
    id            INT UNSIGNED PRIMARY KEY,
    iso2_code     CHAR(2) DEFAULT NULL,
    fallback_name VARCHAR(100) NOT NULL,  -- Estonian name, shown when no translation exists
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estonian locations (cities and counties; IDs match auto24)
CREATE TABLE locations (
    id            INT UNSIGNED PRIMARY KEY,
    parent_id     INT UNSIGNED DEFAULT NULL,  -- NULL = county, set = city inside a county
    fallback_name VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES locations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA FOR LOOKUP TABLES
-- ============================================================

-- Fuel types (IDs from auto24)
INSERT INTO fuel_types (id, technical_name, is_electric, is_hybrid) VALUES
(1,  'petrol',               0, 0),
(2,  'diesel',               0, 0),
(6,  'electric',             1, 0),
(3,  'petrol_lpg',           0, 0),
(10, 'petrol_cng',           0, 0),
(12, 'petrol_lng',           0, 0),
(13, 'diesel_lng',           0, 0),
(4,  'lpg',                  0, 0),
(9,  'cng',                  0, 0),
(11, 'lng',                  0, 0),
(14, 'hybrid_petrol',        0, 1),
(15, 'hybrid_diesel',        0, 1),
(16, 'plug_in_hybrid_petrol',0, 1),
(17, 'plug_in_hybrid_diesel',0, 1),
(7,  'hydrogen',             0, 0),
(8,  'ethanol',              0, 0);

INSERT INTO translations (category, ref_id, language_code, name) VALUES
-- petrol
('fuel_type', 1,  'et', 'Bensiin'),
('fuel_type', 1,  'en', 'Petrol'),
('fuel_type', 1,  'ru', 'Бензин'),
-- diesel
('fuel_type', 2,  'et', 'Diisel'),
('fuel_type', 2,  'en', 'Diesel'),
('fuel_type', 2,  'ru', 'Дизель'),
-- electric
('fuel_type', 6,  'et', 'Elekter'),
('fuel_type', 6,  'en', 'Electric'),
('fuel_type', 6,  'ru', 'Электро'),
-- petrol + LPG
('fuel_type', 3,  'et', 'Bensiin + gaas (LPG)'),
('fuel_type', 3,  'en', 'Petrol + Gas (LPG)'),
('fuel_type', 3,  'ru', 'Бензин + газ (LPG)'),
-- petrol + CNG
('fuel_type', 10, 'et', 'Bensiin + gaas (CNG)'),
('fuel_type', 10, 'en', 'Petrol + Gas (CNG)'),
('fuel_type', 10, 'ru', 'Бензин + газ (CNG)'),
-- petrol + LNG
('fuel_type', 12, 'et', 'Bensiin + gaas (LNG)'),
('fuel_type', 12, 'en', 'Petrol + Gas (LNG)'),
('fuel_type', 12, 'ru', 'Бензин + газ (LNG)'),
-- diesel + LNG
('fuel_type', 13, 'et', 'Diisel + gaas (LNG)'),
('fuel_type', 13, 'en', 'Diesel + Gas (LNG)'),
('fuel_type', 13, 'ru', 'Дизель + газ (LNG)'),
-- LPG only
('fuel_type', 4,  'et', 'Gaas (LPG)'),
('fuel_type', 4,  'en', 'Gas (LPG)'),
('fuel_type', 4,  'ru', 'Газ (LPG)'),
-- CNG only
('fuel_type', 9,  'et', 'Gaas (CNG)'),
('fuel_type', 9,  'en', 'Gas (CNG)'),
('fuel_type', 9,  'ru', 'Газ (CNG)'),
-- LNG only
('fuel_type', 11, 'et', 'Gaas (LNG)'),
('fuel_type', 11, 'en', 'Gas (LNG)'),
('fuel_type', 11, 'ru', 'Газ (LNG)'),
-- hybrid petrol/electric
('fuel_type', 14, 'et', 'Hübriid (bensiin / elekter)'),
('fuel_type', 14, 'en', 'Hybrid (Petrol / Electric)'),
('fuel_type', 14, 'ru', 'Гибрид (бензин / электро)'),
-- hybrid diesel/electric
('fuel_type', 15, 'et', 'Hübriid (diisel / elekter)'),
('fuel_type', 15, 'en', 'Hybrid (Diesel / Electric)'),
('fuel_type', 15, 'ru', 'Гибрид (дизель / электро)'),
-- PHEV petrol
('fuel_type', 16, 'et', 'Pistikühriid (bensiin / elekter)'),
('fuel_type', 16, 'en', 'Plug-in Hybrid (Petrol / Electric)'),
('fuel_type', 16, 'ru', 'Плагин-гибрид (бензин / электро)'),
-- PHEV diesel
('fuel_type', 17, 'et', 'Pistikühriid (diisel / elekter)'),
('fuel_type', 17, 'en', 'Plug-in Hybrid (Diesel / Electric)'),
('fuel_type', 17, 'ru', 'Плагин-гибрид (дизель / электро)'),
-- hydrogen
('fuel_type', 7,  'et', 'Vesinik'),
('fuel_type', 7,  'en', 'Hydrogen'),
('fuel_type', 7,  'ru', 'Водород'),
-- ethanol
('fuel_type', 8,  'et', 'Etanool'),
('fuel_type', 8,  'en', 'Ethanol'),
('fuel_type', 8,  'ru', 'Этанол');

-- Transmissions (IDs 1-3 from auto24)
INSERT INTO transmissions (id, technical_name) VALUES
(1, 'manual'),
(2, 'automatic'),
(3, 'semi_automatic');

INSERT INTO translations (category, ref_id, language_code, name) VALUES
('transmission', 1, 'et', 'Manuaal'),
('transmission', 1, 'en', 'Manual'),
('transmission', 1, 'ru', 'Механика'),
('transmission', 2, 'et', 'Automaat'),
('transmission', 2, 'en', 'Automatic'),
('transmission', 2, 'ru', 'Автомат'),
('transmission', 3, 'et', 'Poolautomaat'),
('transmission', 3, 'en', 'Semi-Automatic'),
('transmission', 3, 'ru', 'Полуавтомат');

-- Drive types (IDs 1-3 from auto24 drives_id)
INSERT INTO drive_types (id, technical_name) VALUES
(1, 'fwd'),
(2, 'rwd'),
(3, 'awd');

INSERT INTO translations (category, ref_id, language_code, name) VALUES
('drive_type', 1, 'et', 'Esivedu'),
('drive_type', 1, 'en', 'Front-Wheel Drive'),
('drive_type', 1, 'ru', 'Передний привод'),
('drive_type', 2, 'et', 'Tagavedu'),
('drive_type', 2, 'en', 'Rear-Wheel Drive'),
('drive_type', 2, 'ru', 'Задний привод'),
('drive_type', 3, 'et', 'Nelikvedu'),
('drive_type', 3, 'en', 'All-Wheel Drive'),
('drive_type', 3, 'ru', 'Полный привод');

-- Colors (IDs from auto24 colors_id)
INSERT INTO colors (id, technical_name, hex_code) VALUES
(1,  'dark_blue',      '#00008B'),
(2,  'blue',           '#1E90FF'),
(3,  'light_blue',     '#ADD8E6'),
(4,  'black',          '#000000'),
(5,  'dark_green',     '#006400'),
(6,  'green',          '#228B22'),
(7,  'light_green',    '#90EE90'),
(8,  'white',          '#FFFFFF'),
(9,  'dark_red',       '#8B0000'),
(10, 'red',            '#FF0000'),
(11, 'light_red',      '#FF6347'),
(12, 'silver',         '#C0C0C0'),
(13, 'dark_grey',      '#696969'),
(14, 'grey',           '#808080'),
(15, 'light_grey',     '#D3D3D3'),
(16, 'dark_purple',    '#4B0082'),
(17, 'purple',         '#800080'),
(18, 'light_purple',   '#DA70D6'),
(19, 'gold',           '#FFD700'),
(20, 'dark_yellow',    '#9B870C'),
(21, 'yellow',         '#FFFF00'),
(22, 'light_yellow',   '#FFFFE0'),
(23, 'dark_beige',     '#8B7355'),
(24, 'beige',          '#F5F5DC'),
(25, 'light_beige',    '#FFF8DC'),
(26, 'dark_brown',     '#4A2C0A'),
(27, 'brown',          '#A52A2A'),
(28, 'light_brown',    '#C4A35A'),
(29, 'dark_orange',    '#D2691E'),
(30, 'orange',         '#FF8C00'),
(31, 'light_orange',   '#FFA07A'),
(32, 'pink',           '#FFC0CB');

INSERT INTO translations (category, ref_id, language_code, name) VALUES
('color', 1,  'et', 'Tumesinine'), ('color', 1,  'en', 'Dark Blue'),     ('color', 1,  'ru', 'Тёмно-синий'),
('color', 2,  'et', 'Sinine'),     ('color', 2,  'en', 'Blue'),           ('color', 2,  'ru', 'Синий'),
('color', 3,  'et', 'Helesinine'), ('color', 3,  'en', 'Light Blue'),     ('color', 3,  'ru', 'Голубой'),
('color', 4,  'et', 'Must'),       ('color', 4,  'en', 'Black'),          ('color', 4,  'ru', 'Чёрный'),
('color', 5,  'et', 'Tumeroheline'),('color', 5, 'en', 'Dark Green'),     ('color', 5,  'ru', 'Тёмно-зелёный'),
('color', 6,  'et', 'Roheline'),   ('color', 6,  'en', 'Green'),          ('color', 6,  'ru', 'Зелёный'),
('color', 7,  'et', 'Heleroheline'),('color', 7, 'en', 'Light Green'),    ('color', 7,  'ru', 'Светло-зелёный'),
('color', 8,  'et', 'Valge'),      ('color', 8,  'en', 'White'),          ('color', 8,  'ru', 'Белый'),
('color', 9,  'et', 'Tumepunane'), ('color', 9,  'en', 'Dark Red'),       ('color', 9,  'ru', 'Тёмно-красный'),
('color', 10, 'et', 'Punane'),     ('color', 10, 'en', 'Red'),            ('color', 10, 'ru', 'Красный'),
('color', 11, 'et', 'Helepunane'), ('color', 11, 'en', 'Light Red'),      ('color', 11, 'ru', 'Светло-красный'),
('color', 12, 'et', 'Hõbedane'),   ('color', 12, 'en', 'Silver'),         ('color', 12, 'ru', 'Серебристый'),
('color', 13, 'et', 'Tumehall'),   ('color', 13, 'en', 'Dark Grey'),      ('color', 13, 'ru', 'Тёмно-серый'),
('color', 14, 'et', 'Hall'),       ('color', 14, 'en', 'Grey'),           ('color', 14, 'ru', 'Серый'),
('color', 15, 'et', 'Helehall'),   ('color', 15, 'en', 'Light Grey'),     ('color', 15, 'ru', 'Светло-серый'),
('color', 16, 'et', 'Tumelilla'),  ('color', 16, 'en', 'Dark Purple'),    ('color', 16, 'ru', 'Тёмно-фиолетовый'),
('color', 17, 'et', 'Lilla'),      ('color', 17, 'en', 'Purple'),         ('color', 17, 'ru', 'Фиолетовый'),
('color', 18, 'et', 'Helelilla'),  ('color', 18, 'en', 'Light Purple'),   ('color', 18, 'ru', 'Светло-фиолетовый'),
('color', 19, 'et', 'Kuldne'),     ('color', 19, 'en', 'Gold'),           ('color', 19, 'ru', 'Золотой'),
('color', 20, 'et', 'Tumekollane'),('color', 20, 'en', 'Dark Yellow'),    ('color', 20, 'ru', 'Тёмно-жёлтый'),
('color', 21, 'et', 'Kollane'),    ('color', 21, 'en', 'Yellow'),         ('color', 21, 'ru', 'Жёлтый'),
('color', 22, 'et', 'Helekollane'),('color', 22, 'en', 'Light Yellow'),   ('color', 22, 'ru', 'Светло-жёлтый'),
('color', 23, 'et', 'Tumebeež'),   ('color', 23, 'en', 'Dark Beige'),     ('color', 23, 'ru', 'Тёмно-бежевый'),
('color', 24, 'et', 'Beež'),       ('color', 24, 'en', 'Beige'),          ('color', 24, 'ru', 'Бежевый'),
('color', 25, 'et', 'Helebeež'),   ('color', 25, 'en', 'Light Beige'),    ('color', 25, 'ru', 'Светло-бежевый'),
('color', 26, 'et', 'Tumepruun'),  ('color', 26, 'en', 'Dark Brown'),     ('color', 26, 'ru', 'Тёмно-коричневый'),
('color', 27, 'et', 'Pruun'),      ('color', 27, 'en', 'Brown'),          ('color', 27, 'ru', 'Коричневый'),
('color', 28, 'et', 'Helepruun'),  ('color', 28, 'en', 'Light Brown'),    ('color', 28, 'ru', 'Светло-коричневый'),
('color', 29, 'et', 'Tumeoranž'),  ('color', 29, 'en', 'Dark Orange'),    ('color', 29, 'ru', 'Тёмно-оранжевый'),
('color', 30, 'et', 'Oranž'),      ('color', 30, 'en', 'Orange'),         ('color', 30, 'ru', 'Оранжевый'),
('color', 31, 'et', 'Heleoranž'),  ('color', 31, 'en', 'Light Orange'),   ('color', 31, 'ru', 'Светло-оранжевый'),
('color', 32, 'et', 'Roosa'),      ('color', 32, 'en', 'Pink'),           ('color', 32, 'ru', 'Розовый');

-- Emission standards
INSERT INTO emission_standards (id, technical_name) VALUES
(1, 'euro1'), (2, 'euro2'), (3, 'euro3'),
(4, 'euro4'), (5, 'euro5'), (6, 'euro6'),
(7, 'euro6b'), (8, 'euro6c'), (9, 'euro6d');

INSERT INTO translations (category, ref_id, language_code, name) VALUES
('emission_standard', 1, 'et', 'Euro 1'), ('emission_standard', 1, 'en', 'Euro 1'), ('emission_standard', 1, 'ru', 'Евро 1'),
('emission_standard', 2, 'et', 'Euro 2'), ('emission_standard', 2, 'en', 'Euro 2'), ('emission_standard', 2, 'ru', 'Евро 2'),
('emission_standard', 3, 'et', 'Euro 3'), ('emission_standard', 3, 'en', 'Euro 3'), ('emission_standard', 3, 'ru', 'Евро 3'),
('emission_standard', 4, 'et', 'Euro 4'), ('emission_standard', 4, 'en', 'Euro 4'), ('emission_standard', 4, 'ru', 'Евро 4'),
('emission_standard', 5, 'et', 'Euro 5'), ('emission_standard', 5, 'en', 'Euro 5'), ('emission_standard', 5, 'ru', 'Евро 5'),
('emission_standard', 6, 'et', 'Euro 6'), ('emission_standard', 6, 'en', 'Euro 6'), ('emission_standard', 6, 'ru', 'Евро 6'),
('emission_standard', 7, 'et', 'Euro 6b'),('emission_standard', 7, 'en', 'Euro 6b'),('emission_standard', 7, 'ru', 'Евро 6b'),
('emission_standard', 8, 'et', 'Euro 6c'),('emission_standard', 8, 'en', 'Euro 6c'),('emission_standard', 8, 'ru', 'Евро 6c'),
('emission_standard', 9, 'et', 'Euro 6d'),('emission_standard', 9, 'en', 'Euro 6d'),('emission_standard', 9, 'ru', 'Евро 6d');

-- Vehicle categories
INSERT INTO vehicle_categories (id, technical_name) VALUES
(1, 'car'), (2, 'suv'), (3, 'van'), (4, 'truck'), (5, 'motorcycle'), (6, 'other');

INSERT INTO translations (category, ref_id, language_code, name) VALUES
('vehicle_category', 1, 'et', 'Sõiduauto'),     ('vehicle_category', 1, 'en', 'Car'),         ('vehicle_category', 1, 'ru', 'Легковой автомобиль'),
('vehicle_category', 2, 'et', 'Maastur / SUV'), ('vehicle_category', 2, 'en', 'SUV'),          ('vehicle_category', 2, 'ru', 'Внедорожник / SUV'),
('vehicle_category', 3, 'et', 'Kaubik / buss'), ('vehicle_category', 3, 'en', 'Van / Bus'),    ('vehicle_category', 3, 'ru', 'Фургон / автобус'),
('vehicle_category', 4, 'et', 'Veoauto'),       ('vehicle_category', 4, 'en', 'Truck'),        ('vehicle_category', 4, 'ru', 'Грузовик'),
('vehicle_category', 5, 'et', 'Mototehnika'),   ('vehicle_category', 5, 'en', 'Motorcycle'),   ('vehicle_category', 5, 'ru', 'Мотоцикл'),
('vehicle_category', 6, 'et', 'Muu'),           ('vehicle_category', 6, 'en', 'Other'),        ('vehicle_category', 6, 'ru', 'Другое');

-- Body types (IDs from auto24 liik field data-values)
INSERT INTO body_types (id, category_id, technical_name) VALUES
(1,  1, 'sedan'),
(2,  1, 'hatchback'),
(3,  1, 'estate'),
(4,  1, 'mpv'),
(5,  1, 'coupe'),
(6,  1, 'convertible'),
(61, 1, 'pickup'),
(67, 1, 'limousine');

INSERT INTO translations (category, ref_id, language_code, name) VALUES
('body_type', 1,  'et', 'Sedaan'),          ('body_type', 1,  'en', 'Sedan'),        ('body_type', 1,  'ru', 'Седан'),
('body_type', 2,  'et', 'Luukpära'),        ('body_type', 2,  'en', 'Hatchback'),    ('body_type', 2,  'ru', 'Хэтчбек'),
('body_type', 3,  'et', 'Universaal'),      ('body_type', 3,  'en', 'Estate / Wagon'),('body_type', 3, 'ru', 'Универсал'),
('body_type', 4,  'et', 'Mahtuniversaal'),  ('body_type', 4,  'en', 'MPV / Minivan'), ('body_type', 4, 'ru', 'Минивэн'),
('body_type', 5,  'et', 'Kupee'),           ('body_type', 5,  'en', 'Coupe'),        ('body_type', 5,  'ru', 'Купе'),
('body_type', 6,  'et', 'Kabriolett'),      ('body_type', 6,  'en', 'Convertible'),  ('body_type', 6,  'ru', 'Кабриолет'),
('body_type', 61, 'et', 'Pikap'),           ('body_type', 61, 'en', 'Pickup'),       ('body_type', 61, 'ru', 'Пикап'),
('body_type', 67, 'et', 'Limusiin'),        ('body_type', 67, 'en', 'Limousine'),    ('body_type', 67, 'ru', 'Лимузин');

-- Countries (IDs from auto24 brought_from_countries_id)
INSERT INTO countries (id, iso2_code, fallback_name) VALUES
(1,  'EE', 'Eesti'),         (2,  'LV', 'Läti'),          (3,  'LT', 'Leedu'),
(4,  'DE', 'Saksamaa'),      (5,  'NL', 'Holland'),        (6,  'CH', 'Šveits'),
(7,  'BE', 'Belgia'),        (8,  'DK', 'Taani'),          (9,  'AT', 'Austria'),
(10, 'FR', 'Prantsusmaa'),   (11, 'LU', 'Luksemburg'),     (12, 'SE', 'Rootsi'),
(13, 'CZ', 'Tšehhi'),        (14, 'IT', 'Itaalia'),        (15, 'HU', 'Ungari'),
(16, 'US', 'Ameerika Ühendriigid'), (17, 'FI', 'Soome'),  (18, 'RU', 'Venemaa'),
(19, 'GB', 'Inglismaa'),     (20, 'JP', 'Jaapan'),         (21, 'PL', 'Poola'),
(22, 'BG', 'Bulgaaria'),     (23, 'GR', 'Kreeka'),         (24, 'IE', 'Iirimaa'),
(25, 'CY', 'Küpros'),        (26, 'MT', 'Malta'),          (27, 'GB', 'Suurbritannia'),
(28, 'PT', 'Portugal'),      (29, 'RO', 'Rumeenia'),       (30, 'SK', 'Slovakkia'),
(31, 'SI', 'Sloveenia'),     (32, 'ES', 'Hispaania'),      (33, 'NO', 'Norra'),
(34, 'TR', 'Türgi'),         (35, 'HR', 'Horvaatia'),      (36, 'UA', 'Ukraina'),
(37, 'CA', 'Kanada'),        (38, 'AE', 'Araabia Ühendemiraadid'), (39, 'KR', 'Lõuna-Korea');

INSERT INTO translations (category, ref_id, language_code, name) VALUES
('country', 1,  'en', 'Estonia'),          ('country', 1,  'ru', 'Эстония'),
('country', 2,  'en', 'Latvia'),           ('country', 2,  'ru', 'Латвия'),
('country', 3,  'en', 'Lithuania'),        ('country', 3,  'ru', 'Литва'),
('country', 4,  'en', 'Germany'),          ('country', 4,  'ru', 'Германия'),
('country', 5,  'en', 'Netherlands'),      ('country', 5,  'ru', 'Нидерланды'),
('country', 6,  'en', 'Switzerland'),      ('country', 6,  'ru', 'Швейцария'),
('country', 7,  'en', 'Belgium'),          ('country', 7,  'ru', 'Бельгия'),
('country', 8,  'en', 'Denmark'),          ('country', 8,  'ru', 'Дания'),
('country', 9,  'en', 'Austria'),          ('country', 9,  'ru', 'Австрия'),
('country', 10, 'en', 'France'),           ('country', 10, 'ru', 'Франция'),
('country', 11, 'en', 'Luxembourg'),       ('country', 11, 'ru', 'Люксембург'),
('country', 12, 'en', 'Sweden'),           ('country', 12, 'ru', 'Швеция'),
('country', 13, 'en', 'Czech Republic'),   ('country', 13, 'ru', 'Чехия'),
('country', 14, 'en', 'Italy'),            ('country', 14, 'ru', 'Италия'),
('country', 15, 'en', 'Hungary'),          ('country', 15, 'ru', 'Венгрия'),
('country', 16, 'en', 'United States'),    ('country', 16, 'ru', 'США'),
('country', 17, 'en', 'Finland'),          ('country', 17, 'ru', 'Финляндия'),
('country', 18, 'en', 'Russia'),           ('country', 18, 'ru', 'Россия'),
('country', 19, 'en', 'England'),          ('country', 19, 'ru', 'Англия'),
('country', 20, 'en', 'Japan'),            ('country', 20, 'ru', 'Япония'),
('country', 21, 'en', 'Poland'),           ('country', 21, 'ru', 'Польша'),
('country', 22, 'en', 'Bulgaria'),         ('country', 22, 'ru', 'Болгария'),
('country', 23, 'en', 'Greece'),           ('country', 23, 'ru', 'Греция'),
('country', 24, 'en', 'Ireland'),          ('country', 24, 'ru', 'Ирландия'),
('country', 25, 'en', 'Cyprus'),           ('country', 25, 'ru', 'Кипр'),
('country', 26, 'en', 'Malta'),            ('country', 26, 'ru', 'Мальта'),
('country', 27, 'en', 'United Kingdom'),   ('country', 27, 'ru', 'Великобритания'),
('country', 28, 'en', 'Portugal'),         ('country', 28, 'ru', 'Португалия'),
('country', 29, 'en', 'Romania'),          ('country', 29, 'ru', 'Румыния'),
('country', 30, 'en', 'Slovakia'),         ('country', 30, 'ru', 'Словакия'),
('country', 31, 'en', 'Slovenia'),         ('country', 31, 'ru', 'Словения'),
('country', 32, 'en', 'Spain'),            ('country', 32, 'ru', 'Испания'),
('country', 33, 'en', 'Norway'),           ('country', 33, 'ru', 'Норвегия'),
('country', 34, 'en', 'Turkey'),           ('country', 34, 'ru', 'Турция'),
('country', 35, 'en', 'Croatia'),          ('country', 35, 'ru', 'Хорватия'),
('country', 36, 'en', 'Ukraine'),          ('country', 36, 'ru', 'Украина'),
('country', 37, 'en', 'Canada'),           ('country', 37, 'ru', 'Канада'),
('country', 38, 'en', 'UAE'),              ('country', 38, 'ru', 'ОАЭ'),
('country', 39, 'en', 'South Korea'),      ('country', 39, 'ru', 'Южная Корея');

-- Estonian locations (counties have parent_id NULL; cities point to their county)
INSERT INTO locations (id, parent_id, fallback_name) VALUES
-- Counties
(15,  NULL, 'Harjumaa'),  (12,  NULL, 'Hiiumaa'),    (20,  NULL, 'Ida-Virumaa'),
(29,  NULL, 'Järvamaa'),  (50,  NULL, 'Jõgevamaa'),  (26,  NULL, 'Lääne-Virumaa'),
(27,  NULL, 'Läänemaa'),  (52,  NULL, 'Pärnumaa'),   (51,  NULL, 'Põlvamaa'),
(53,  NULL, 'Raplamaa'),  (54,  NULL, 'Saaremaa'),   (55,  NULL, 'Tartumaa'),
(56,  NULL, 'Valgamaa'),  (57,  NULL, 'Viljandimaa'),(58,  NULL, 'Võrumaa'),
-- Cities / towns
(3,  15, 'Tallinn'),   (48, 15, 'Maardu'),    (37, 15, 'Keila'),   (102, 15, 'Saue'),  (243, 15, 'Saku'),
(1,  55, 'Tartu'),     (44, 55, 'Elva'),
(5,  52, 'Pärnu'),     (33, 52, 'Kilingi-Nõmme'), (104, 52, 'Sindi'),
(9,  26, 'Rakvere'),   (59, 26, 'Kunda'),     (39, 26, 'Tapa'),    (112, 26, 'Tamsalu'),
(35, 20, 'Narva'),     (36, 20, 'Kohtla-Järve'), (23, 20, 'Jõhvi'), (96, 20, 'Kiviõli'), (103, 20, 'Sillamäe'), (100, 20, 'Narva-Jõesuu'),
(4,  56, 'Valga'),
(8,  57, 'Viljandi'),  (60, 57, 'Karksi-Nuia'), (111, 57, 'Suure-Jaani'), (106, 57, 'Võhma'),
(6,  58, 'Võru'),      (110, 58, 'Räpina'),
(7,  54, 'Kuressaare'),
(19, 27, 'Haapsalu'),  (109, 27, 'Lihula'),
(25, 29, 'Paide'),     (113, 29, 'Türi'),     (108, 29, 'Antsla'),
(17, 50, 'Jõgeva'),    (94, 50, 'Kallaste'),  (99, 50, 'Mustvee'),
(14, 50, 'Põltsamaa'),
(13, 51, 'Põlva'),
(11, 53, 'Rapla'),     (28, 53, 'Paldiski'),
(32, 55, 'Otepää'),    (105, 56, 'Tõrva'),
(95, 12, 'Kärdla'),
(97, 15, 'Loksa'),     (93, 15, 'Kehra'),
(98, 57, 'Mõisaküla'),
(101, 20, 'Püssi'),    (107, 57, 'Abja-Paluoja');

-- ============================================================
-- CAR MAKES & MODELS
-- ============================================================

-- 1. CAR MAKES (e.g., BMW, Audi, Toyota)
CREATE TABLE car_makes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,  -- clean URL slug (autod.pro/bmw)
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CAR MODELS (e.g., 3 Series, A4, RAV4)
CREATE TABLE car_models (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    make_id INT UNSIGNED NOT NULL,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (make_id) REFERENCES car_makes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_make_model (make_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. MODEL PERIODS / GENERATIONS (e.g., BMW 3 Series E46: 1998–2006)
CREATE TABLE model_periods (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    model_id  INT UNSIGNED NOT NULL,
    name      VARCHAR(100) NOT NULL,        -- e.g. "2010 - 2014" or "E46"
    year_from SMALLINT UNSIGNED DEFAULT NULL,
    year_to   SMALLINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (model_id) REFERENCES car_models(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- EQUIPMENT / EXTRAS FEATURE TABLES
-- Based on auto24 lisad[] checkboxes from the ad submission form
-- ============================================================

-- Equipment categories (groups shown in the form)
CREATE TABLE feature_categories (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technical_name VARCHAR(50) NOT NULL UNIQUE,
    sort_order TINYINT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Individual equipment items (lisad[] IDs match auto24)
CREATE TABLE car_features (
    id            INT UNSIGNED PRIMARY KEY,  -- explicit auto24 lisad[] ID
    category_id   INT UNSIGNED NOT NULL,
    technical_name VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES feature_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MAIN CAR LISTINGS TABLE
-- Replaces old car_listings with full field coverage from HTML form
-- ============================================================
CREATE TABLE car_listings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,

    -- Vehicle identity (locked after activation)
    make_id         INT UNSIGNED NOT NULL,
    model_id        INT UNSIGNED NOT NULL,
    model_period_id INT UNSIGNED DEFAULT NULL,
    model_trim      VARCHAR(100) DEFAULT NULL,    -- e.g. "M Sport", "SE", "GTI"
    category_id     INT UNSIGNED DEFAULT NULL,
    body_type_id    INT UNSIGNED DEFAULT NULL,

    -- Registration & VIN
    vin_code VARCHAR(17) DEFAULT NULL,
    reg_nr   VARCHAR(20) DEFAULT NULL,            -- plate number (used for VIN lookup)

    -- Core search filters
    year_manufactured  SMALLINT UNSIGNED NOT NULL,
    month_manufactured TINYINT UNSIGNED DEFAULT NULL,   -- 1–12
    mileage            INT UNSIGNED NOT NULL,            -- km
    fuel_type_id       INT UNSIGNED NOT NULL,
    transmission_id    INT UNSIGNED DEFAULT NULL,
    drive_type_id      INT UNSIGNED DEFAULT NULL,

    -- Engine
    engine_displacement_cc SMALLINT UNSIGNED DEFAULT NULL,
    engine_power_kw        SMALLINT UNSIGNED DEFAULT NULL,
    engine_power_hp        SMALLINT UNSIGNED DEFAULT NULL,
    engine_info            VARCHAR(100) DEFAULT NULL,    -- e.g. "2.0 TDI 150 PS"
    emission_standard_id   INT UNSIGNED DEFAULT NULL,
    co2_emission_gkm       SMALLINT UNSIGNED DEFAULT NULL,

    -- Fuel consumption (L/100km or kWh/100km for EV)
    fuel_consumption_city    DECIMAL(5,2) DEFAULT NULL,
    fuel_consumption_highway DECIMAL(5,2) DEFAULT NULL,
    fuel_consumption_mixed   DECIMAL(5,2) DEFAULT NULL,
    fuel_tank_capacity_l     SMALLINT UNSIGNED DEFAULT NULL, -- litres (or kWh battery for EV)

    -- Body & passenger space
    doors TINYINT UNSIGNED DEFAULT NULL,
    seats TINYINT UNSIGNED DEFAULT NULL,

    -- Dimensions (mm)
    vehicle_length_mm INT UNSIGNED DEFAULT NULL,
    vehicle_width_mm  INT UNSIGNED DEFAULT NULL,
    vehicle_height_mm INT UNSIGNED DEFAULT NULL,
    wheelbase_mm      INT UNSIGNED DEFAULT NULL,

    -- Weight & towing (kg)
    kerb_weight_kg          INT UNSIGNED DEFAULT NULL,
    gross_weight_kg         INT UNSIGNED DEFAULT NULL,
    payload_kg              INT UNSIGNED DEFAULT NULL,
    tow_capacity_braked_kg  INT UNSIGNED DEFAULT NULL,
    tow_capacity_unbraked_kg INT UNSIGNED DEFAULT NULL,

    -- Performance
    acceleration_0_100 DECIMAL(4,1) DEFAULT NULL,  -- seconds
    max_speed_kph      SMALLINT UNSIGNED DEFAULT NULL,

    -- Color & appearance
    color_id      INT UNSIGNED DEFAULT NULL,
    color_finish  ENUM('solid','metallic','pearl','matte') DEFAULT NULL,

    -- Inspection & service history
    inspection_valid_until DATE DEFAULT NULL,
    has_service_book       TINYINT(1) DEFAULT 0,

    -- Warranty
    has_warranty          TINYINT(1) DEFAULT 0,
    warranty_description  VARCHAR(255) DEFAULT NULL,

    -- Condition flags
    is_crash_damaged        TINYINT(1) DEFAULT 0,
    parts_sold_separately   TINYINT(1) DEFAULT 0,
    parts_info              TEXT DEFAULT NULL,
    registered_as_commercial TINYINT(1) DEFAULT 0,  -- autod[arvel] = N1 van

    -- Origin & location
    location_id               INT UNSIGNED DEFAULT NULL,
    imported_from_country_id  INT UNSIGNED DEFAULT NULL,

    -- Pricing
    price                  DECIMAL(10,2) NOT NULL,
    discount_price         DECIMAL(10,2) DEFAULT NULL,
    export_price           DECIMAL(10,2) DEFAULT NULL,
    currency               CHAR(3) DEFAULT 'EUR',
    price_includes_vat     TINYINT(1) DEFAULT 0,
    price_includes_reg_fee TINYINT(1) DEFAULT 0,

    -- TCO estimates (pre-calculated for fast index queries)
    est_monthly_loan        DECIMAL(8,2) DEFAULT 0.00,
    est_monthly_insurance   DECIMAL(8,2) DEFAULT 0.00,
    est_monthly_maintenance DECIMAL(8,2) DEFAULT 0.00,

    -- Listing state
    status      ENUM('draft','active','sold','expired') DEFAULT 'draft',
    views_count INT UNSIGNED DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (make_id)         REFERENCES car_makes(id),
    FOREIGN KEY (model_id)        REFERENCES car_models(id),
    FOREIGN KEY (model_period_id) REFERENCES model_periods(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id)     REFERENCES vehicle_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (body_type_id)    REFERENCES body_types(id) ON DELETE SET NULL,
    FOREIGN KEY (fuel_type_id)    REFERENCES fuel_types(id),
    FOREIGN KEY (transmission_id) REFERENCES transmissions(id) ON DELETE SET NULL,
    FOREIGN KEY (drive_type_id)   REFERENCES drive_types(id) ON DELETE SET NULL,
    FOREIGN KEY (emission_standard_id) REFERENCES emission_standards(id) ON DELETE SET NULL,
    FOREIGN KEY (color_id)        REFERENCES colors(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id)     REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (imported_from_country_id) REFERENCES countries(id) ON DELETE SET NULL,

    INDEX idx_status_price   (status, price),
    INDEX idx_search_filters (make_id, model_id, year_manufactured, price),
    INDEX idx_fuel_trans     (fuel_type_id, transmission_id),
    INDEX idx_body           (body_type_id, category_id),
    INDEX idx_location       (location_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Multilingual ad title & description (separate from the lookup translations table)
CREATE TABLE car_listing_translations (
    listing_id    BIGINT UNSIGNED NOT NULL,
    language_code CHAR(2) NOT NULL,   -- 'et', 'en', 'ru'
    title         VARCHAR(150) NOT NULL,
    description   TEXT,
    PRIMARY KEY (listing_id, language_code),
    FOREIGN KEY (listing_id) REFERENCES car_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment items linked to a listing (lisad[] checkboxes)
CREATE TABLE car_listing_features (
    listing_id BIGINT UNSIGNED NOT NULL,
    feature_id INT UNSIGNED NOT NULL,
    extra_info VARCHAR(255) DEFAULT NULL,  -- free-text detail (lisainfo[] field)
    PRIMARY KEY (listing_id, feature_id),
    FOREIGN KEY (listing_id) REFERENCES car_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES car_features(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Car images
CREATE TABLE car_images (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    listing_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    is_main    TINYINT(1) DEFAULT 0,
    sort_order TINYINT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES car_listings(id) ON DELETE CASCADE,
    INDEX idx_listing_images (listing_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PREMIUM LISTING FEATURES & PAYMENTS
-- ============================================================

-- Available paid promotion options (bold title, highlight, top of search, etc.)
CREATE TABLE premium_features (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technical_name VARCHAR(50) NOT NULL UNIQUE,
    price_per_day  DECIMAL(6,2) NOT NULL,
    is_active      TINYINT(1) DEFAULT 1,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Active promotions on a listing with expiry tracking
CREATE TABLE car_listing_premium_features (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    listing_id   BIGINT UNSIGNED NOT NULL,
    feature_id   INT UNSIGNED NOT NULL,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at   TIMESTAMP NOT NULL,
    is_active    TINYINT(1) GENERATED ALWAYS AS (expires_at > CURRENT_TIMESTAMP) STORED,
    FOREIGN KEY (listing_id) REFERENCES car_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES premium_features(id),
    INDEX idx_active_listing_features (listing_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shopping cart / payment intent (one order can cover multiple features/listings)
CREATE TABLE feature_orders (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      INT UNSIGNED NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,   -- includes Estonian VAT 22% where applicable
    currency     VARCHAR(3) DEFAULT 'EUR',
    status       ENUM('pending','paid','failed','cancelled') DEFAULT 'pending',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_orders (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Line items within an order
CREATE TABLE feature_order_items (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id      BIGINT UNSIGNED NOT NULL,
    listing_id    BIGINT UNSIGNED NOT NULL,
    feature_id    INT UNSIGNED NOT NULL,
    days_purchased INT UNSIGNED NOT NULL,
    price         DECIMAL(8,2) NOT NULL,   -- historic price at time of purchase
    FOREIGN KEY (order_id)   REFERENCES feature_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES car_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES premium_features(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment gateway transactions (Montonio / EveryPay / Maksekeskus / Stripe)
CREATE TABLE payment_transactions (
    id                     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id               BIGINT UNSIGNED NOT NULL,
    gateway                ENUM('montonio','everypay','maksekeskus','stripe') NOT NULL,
    gateway_transaction_id VARCHAR(255) NOT NULL UNIQUE,
    payment_method         VARCHAR(50) DEFAULT NULL,   -- 'swedbank','seb','lhv','visa'
    amount                 DECIMAL(10,2) NOT NULL,
    currency               VARCHAR(3) DEFAULT 'EUR',
    status                 ENUM('initiated','authorized','completed','failed','refunded') DEFAULT 'initiated',
    request_payload        JSON DEFAULT NULL,           -- payload sent to gateway
    callback_payload       JSON DEFAULT NULL,           -- raw data received from gateway
    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES feature_orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;