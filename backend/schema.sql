-- =========================================================
-- EGNA — Schéma MySQL
-- =========================================================
CREATE DATABASE IF NOT EXISTS egna_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE egna_db;

-- ---------------------------------------------------------
-- 1. Paramètres généraux du site (une seule ligne, id = 1)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id                 TINYINT PRIMARY KEY DEFAULT 1,
  hero_title         VARCHAR(255) NOT NULL,
  hero_subtitle      VARCHAR(255) NOT NULL,
  hero_motto         VARCHAR(255) NOT NULL,
  hero_cta_label     VARCHAR(100) NOT NULL,
  apropos_mission    TEXT NOT NULL,
  apropos_campus     TEXT NOT NULL,
  historique_intro   TEXT NOT NULL,
  historique_body    TEXT NOT NULL,
  contact_address    VARCHAR(255) NOT NULL,
  
  contact_phone      VARCHAR(50)  NOT NULL,
  contact_email      VARCHAR(150) NOT NULL,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- ---------------------------------------------------------
-- 2. Formations proposées (cartes "Nos Formations")
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS formations (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  icon        VARCHAR(50) NOT NULL DEFAULT 'shield', -- shield | flag | book
  title       VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  ordre       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 3. Dates clés de l'historique (timeline)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS historique_dates (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  annee       VARCHAR(20) NOT NULL,
  evenement   TEXT NOT NULL,
  ordre       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 4. Commandement actuel
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS commandement (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  role        VARCHAR(150) NOT NULL,
  name        VARCHAR(150) NOT NULL,
  since_label VARCHAR(50),
  bio         TEXT NOT NULL,
  img         VARCHAR(255),
  ordre       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 5. Anciens commandants
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS anciens_commandants (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  period      VARCHAR(50) NOT NULL,
  ordre       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 6. Actualités
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS actualites (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  date_pub    VARCHAR(50) NOT NULL,   -- affichage libre ("19 Décembre 2025")
  title       VARCHAR(255) NOT NULL,
  excerpt     TEXT NOT NULL,
  body        TEXT NOT NULL,
  img         VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- SEED — données actuelles du site (defaultData)
-- =========================================================

INSERT INTO site_settings
  (id, hero_title, hero_subtitle, hero_motto, hero_cta_label,
   apropos_mission, apropos_campus, historique_intro, historique_body,
   contact_address, contact_phone, contact_email)
VALUES
  (1,
   'École de la Gendarmerie Nationale', 'Ambositra', 'Fahaizana · Fahendrena', 'Découvrir l''école',
   'L''École de la Gendarmerie Nationale d''Ambositra forme les futurs gendarmes de Madagascar dans les domaines militaire, juridique et éthique. Notre institution prépare des hommes et des femmes au service de la nation, de la sécurité publique et de l''état de droit.',
   'Situé à Ankorombe Ambositra, notre camp offre des infrastructures modernes : salles de cours, terrains de sport, stand de tir et hébergements. Les élèves bénéficient d''un cadre propice à l''apprentissage et à la cohésion de troupe.',
   'L''École de la Gendarmerie Nationale d''Ambositra (EGNA) est le principal centre de formation des élèves-gendarmes de Madagascar, situé à Ankorombe dans la région Amoron''i Mania.',
   'Fondée le 15 avril 1976 sous le nom de Sekoly Zandarimariam-pirenena Ambositra (SZPA), l''école a été commandée à ses débuts par le Capitaine Hemercellin Andriamahefa. À l''occasion de son 20e anniversaire en 1996, la SZPA devient officiellement l''EGNA. En 2020, l''école reçoit officiellement le nom du Général Hemercellin Andriamahefa. En 2021, l''école avait déjà formé environ 20 000 élèves-gendarmes, dont près de 600 femmes.',
   'Ankorombe Ambositra 306, Amoron''i Mania, Madagascar', '+261 20 000 00', 'egn.ambositra@gendarmerie.mg'
  )
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO formations (icon, title, description, ordre) VALUES
  ('shield', 'FETTA', 'Formation Élémentaire et Tactique et Technique de toutes Armes — instruction militaire et professionnelle de base assurée par l''école.', 1),
  ('flag',   'Présentation au drapeau', 'Cérémonie marquant l''intégration officielle des élèves-gendarmes dans le corps des gendarmes de Madagascar.', 2),
  ('book',   'Formation spécifique', 'Formation spécifique à la Gendarmerie d''environ 9 mois couvrant toutes les techniques essentielles du métier de gendarme.', 3);

INSERT INTO historique_dates (annee, evenement, ordre) VALUES
  ('1976', 'Création de la SZPA — premier commandant : Capitaine Hemercellin Andriamahefa', 1),
  ('1996', 'La SZPA devient officiellement l''EGNA', 2),
  ('2012', 'Premier recrutement féminin — 69e cours de formation', 3),
  ('2020', 'Réhabilitation avec l''appui du PNUD & rebaptisation au nom du Général Andriamahefa', 4),
  ('2025', 'Modernisation de la place d''armes et installation d''un système de biogaz', 5);

INSERT INTO commandement (role, name, since_label, bio, img, ordre) VALUES
  ('Commandant de l''École', 'Colonel Jean Michel RASOLOFONIARY', '2025 – Présent',
   'Officier supérieur diplômé de l''Académie Militaire d''Antsirabe, plus de 25 années de service. Ancien Directeur des Instruction de l''EGNA et Officier Adjoint du Commandant de la CIRGN Toliara. Sa vision repose sur l''excellence académique, l''intégrité morale et le rapprochement avec la population civile.',
   '/photos/COMECOLE.jpg', 1),
  ('Officier Adjoint au Commandant', 'Lieutenant Colonel Léon RANDRIMANANTENA', '2026',
   'Officier de la Gendarmerie Nationale depuis 2005, spécialisé en gestion des opérations. Supervise les opérations pédagogiques et la coordination entre les différents départements de l''école. Il est responsable du bien-être des élèves-gendarmes et du maintien des standards disciplinaires.',
   '/photos/OA.JPG', 2),
  ('Directeur de l''Instruction', 'Lieutenant Colonel Rajo ANDRIANTSIRANOMENA', '2026',
   'Militaire émérite avec plus de 30 années de service, titulaire de plusieurs diplômes en pédagogie militaire. Conçoit et supervise l''ensemble des programmes de formation, en veillant à ce que chaque élève reçoive une éducation complète et de qualité, conforme aux standards internationaux.',
   '/photos/DI.JPG', 3);

INSERT INTO anciens_commandants (name, period, ordre) VALUES
  ('Colonel Rémy RABETOKOTANY', '1976 – 1982', 1),
  ('Général Jean RAKOTOMANGA', '1982 – 1991', 2),
  ('Colonel François ANDRIAMPOINIMERINA', '1991 – 2001', 3),
  ('Colonel Léopold RAKOTOARIMANANA', '2001 – 2008', 4),
  ('Général Hervé RATSIRAKA', '2008 – 2015', 5),
  ('Colonel Christophe RASOLOFONJATOVA', '2015 – 2021', 6),
  ('Lieutenant Colonel Marcel RAZAFINDRAIBE', '2021 – 2025', 7);

INSERT INTO actualites (date_pub, title, excerpt, body, img) VALUES
  ('19 Décembre 2025', 'Sortie de la promotion 2024',
   'La 79e promotion « FIARO » a officiellement achevé sa formation avec une cérémonie présidée par le Ministre chargé de la Gendarmerie Nationale.',
   'La 79e promotion « FIARO » a officiellement achevé sa formation avec une cérémonie présidée par Monsieur le Ministre Chargé de la Gendarmerie Nationale. En parallèle, la passation de commandement entre le Général Fetra (sortant) et le Colonel Jean Michel RASOLOFONIARY (entrant) s''est tenue le même jour, marquant un tournant important dans la direction de l''école.',
   NULL),
  ('28 Février 2026', 'Journée reboisement de l''EGNA',
   'Ankofa a été l''endroit choisi pour la journée de reboisement annuel sous la conduite du Colonel RASOLOFONIARY.',
   'Ankofa a été l''endroit choisi par l''école pour la journée de reboisement annuel. Le Colonel Jean Michel RASOLOFONIARY a mentionné qu''il ne suffit pas seulement de planter les jeunes arbres mais aussi de les surveiller de près — une responsabilité environnementale que l''EGNA prend très au sérieux.',
   NULL),
  ('07 Avril 2026', 'Tournoi Coupe Commandant de l''école',
   'Ouverture officielle du tournoi couvrant football, basket-ball, volley-ball et pétanque sur cinq jours.',
   'L''ouverture officielle du Tournoi Coupe Commandant s''est déroulée le 7 avril 2026. Les disciplines retenues sont le football, le basket-ball, le volley-ball et la pétanque. Le tournoi s''est étalé sur cinq jours, la finale ayant eu lieu le 11 avril, dans une ambiance de cohésion et de fair-play entre les promotions.',
   NULL),
  ('10 Mai 2026', 'Entrée officielle de la 80e promotion',
   '1 500 élèves-gendarmes issus de toutes les régions de Madagascar ont rejoint l''EGNA au stade Manarapenitra.',
   'La cérémonie d''entrée officielle de la 80e promotion s''est déroulée au stade Manarapenitra d''Ankorobe, en présence du Général Jean Hubert ZIPA (Secrétaire Général de la Gendarmerie Nationale) et du Général Nonos Mbina MAMELISOA (Commandant de la Gendarmerie Nationale). Cette promotion regroupe 1 500 élèves-gendarmes recrutés de toutes les régions de Madagascar.',
   NULL);
