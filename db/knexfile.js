const config = require('../config');

module.exports = {
  client: 'pg',
  connection: {
    host: config.db.host,
    user: config.db.user,
    port: config.db.port,
    password: null,
    database: config.db.name,
  },
  migrations: {
    directory: `${__dirname}/migrations`,
  },
  seeds: {
    directory: `${__dirname}/seeds`,
  },
  pool: { min: 0, max: 10 },
};
