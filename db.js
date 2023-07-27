const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todolistapp",
  password: "pw123",
  port: "5432",
});

module.exports = pool;
