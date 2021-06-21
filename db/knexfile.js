const { knexSnakeCaseMappers } = require("objection");

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "ec2-34-247-118-233.eu-west-1.compute.amazonaws.com",
      port: 5432,
      database: "d4nlsklhe7hgsf",
      user: "elamapgtacnmgw",
      password:
        "aa66f346a1f5044bb6b7c56c9762534180cda637ac2afbce6c098c4cd64a8439",
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations1",
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