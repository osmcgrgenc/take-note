const { knexSnakeCaseMappers } = require("objection");

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "ec2-3-218-71-191.compute-1.amazonaws.com",
      port: 5432,
      database: "d7t4totks94eo9",
      user: "lpljtcdqpifpof",
      password:
        "c3674f7ca7ee5ea541e6d410260fd3e26573ed605d33c15336e12d2cf4af5ae8",
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    // automatically convert camelCase to snake case
    // so table names are in snake case
    // but we can use camelCase fields per default
    ...knexSnakeCaseMappers(),
  },
};