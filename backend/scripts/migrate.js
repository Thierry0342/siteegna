/**
 * Runner de migrations SQL — synchronise automatiquement le schéma
 * de la base sur n'importe quel serveur où l'app est lancée.
 *
 * Fonctionnement :
 *  1. Crée une table `migrations` si elle n'existe pas (historique des scripts déjà exécutés).
 *  2. Lit tous les fichiers .sql du dossier /migrations, triés par nom.
 *  3. Exécute uniquement ceux qui ne sont pas encore dans la table `migrations`.
 *  4. Enregistre chaque migration appliquée pour ne jamais la rejouer.
 *
 * Utilisation :
 *   node scripts/migrate.js
 *   (ou: npm run migrate)
 *
 * À intégrer aussi au démarrage du serveur (voir server.js) pour que
 * ça se synchronise automatiquement à chaque déploiement.
 */

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

async function ensureMigrationsTable(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function getAppliedMigrations(conn) {
  const [rows] = await conn.query("SELECT name FROM migrations");
  return new Set(rows.map((r) => r.name));
}

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // l'ordre alphabétique = ordre d'exécution -> préfixez vos fichiers (001_, 002_, ...)
}

async function runMigrations() {
  const conn = await pool.getConnection();
  try {
    await ensureMigrationsTable(conn);
    const applied = await getAppliedMigrations(conn);
    const files = getMigrationFiles();
    const pending = files.filter((f) => !applied.has(f));

    if (!pending.length) {
      console.log("[migrate] Base de données déjà à jour, aucune migration à appliquer.");
      return;
    }

    for (const file of pending) {
      const fullPath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(fullPath, "utf8");

      console.log(`[migrate] Application de ${file}...`);
      await conn.beginTransaction();
      try {
        // Autorise plusieurs instructions séparées par ";" dans un même fichier
        const statements = sql
          .split(/;\s*(?:\r?\n|$)/)
          .map((s) => s.trim())
          .filter(Boolean);

        for (const statement of statements) {
          await conn.query(statement);
        }

        await conn.query("INSERT INTO migrations (name) VALUES (?)", [file]);
        await conn.commit();
        console.log(`[migrate] OK: ${file}`);
      } catch (err) {
        await conn.rollback();
        throw new Error(`Échec de la migration ${file}: ${err.message}`);
      }
    }

    console.log(`[migrate] ${pending.length} migration(s) appliquée(s) avec succès.`);
  } finally {
    conn.release();
  }
}

// Permet d'appeler ce script directement (node scripts/migrate.js)
// OU de l'importer/appeler (await runMigrations()) depuis server.js
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[migrate] ERREUR:", err.message);
      process.exit(1);
    });
}

module.exports = runMigrations;
