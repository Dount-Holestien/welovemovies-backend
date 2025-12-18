const path = require("path");

const MIGRATIONS_DIR = path.join(__dirname, "src", "db", "migrations");
const SEEDS_DIR = path.join(__dirname, "src", "db", "seeds");

module.exports = {
  development: {
    client: "postgresql",
    connection:
      process.env.DATABASE_URL || "postgres://localhost/we_love_movies",
    migrations: { directory: MIGRATIONS_DIR },
    seeds: { directory: SEEDS_DIR },
  },

  test: {
    client: "sqlite3",
    connection: { filename: ":memory:" },
    useNullAsDefault: true,
    migrations: { directory: MIGRATIONS_DIR },
    seeds: { directory: SEEDS_DIR },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    migrations: { directory: MIGRATIONS_DIR },
    seeds: { directory: SEEDS_DIR },
    pool: { min: 2, max: 10 },
  },
};
