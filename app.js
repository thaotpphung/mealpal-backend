const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./src/errors/AppError');
const globalErrorHandler = require('./src/errors/ErrorHandler');
const userRoutes = require('./src/routes/users.js');
const weekRoutes = require('./src/routes/weeks.js');
const recipeRoutes = require('./src/routes/recipes.js');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Development logging
if (process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'local') {
  app.use(morgan('dev'));
}

// SECURITY
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// body paser, reading data from body into req body
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(express.json({ limit: '30mb', extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/weeks', weekRoutes);
app.use('/api/recipes', recipeRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to MealPal API!');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
