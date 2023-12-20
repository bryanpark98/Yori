import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

process.on('unhandledRejection', (ex) => {
  throw ex;
});

process.on('uncaughtException', (ex) => {
  logger.error(ex.message, ex);
  process.exit(1);
});

export default logger;
