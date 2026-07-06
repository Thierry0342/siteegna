-- Migration 003: ajoute une photo aux anciens commandants
ALTER TABLE `anciens_commandants`
  ADD COLUMN `img` varchar(255) DEFAULT NULL AFTER `period`;
