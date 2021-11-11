const mongoose = require('mongoose');
const log = require('npmlog');
const config = require('./config');

process.on('uncaughtException', (err) => {
  log.error('UncaughtException', err);
  process.exit(1);
});

const app = require('./app');

mongoose
  .connect(config.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => log.info(`DB connection successful`));

const server = app.listen(config.PORT, () => {
  log.info(`App running on port ${config.PORT}`);
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
