const mongoose = require('mongoose');
const dotenv = require('dotenv');
const log = require('npmlog');

process.on('uncaughtException', (err) => {
  log.error('UncaughtException', err);
  process.exit(1);
});

dotenv.config();
const app = require('./app');

// db config
let connectionUrl;
const env = process.env.NODE_ENV;
log.info('environment', process.env.NODE_ENV);

switch (env) {
  case 'develop': {
    log.info('connecting to develop db', process.env.MONGODB_DEVELOP);
    connectionUrl = process.env.MONGODB_DEVELOP;
    break;
  }
  case 'production': {
    log.info('connecting to production db', process.env.MONGODB_PRODUCTION);
    connectionUrl = process.env.MONGODB_PRODUCTION;
    break;
  }
  case 'local': {
    log.info('connecting to local db', process.env.MONGODB_LOCAL);
    connectionUrl = process.env.MONGODB_LOCAL;
    break;
  }
  default:
    connectionUrl = process.env.MONGODB_LOCAL;
}

log.info('connection url', connectionUrl);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(connectionUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => log.info(`DB connection successful`));

const server = app.listen(PORT, () => {
  log.info(`App running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  log.error('UNHANDLED REJECTION!', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  log.error('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    log.error('💥 Process terminated!');
  });
});
