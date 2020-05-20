const express = require('express');
const expressip = require('express-ip');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const getIPDetailsRouter = require('./routes/getIPDetailsRoutes');
const existenceRouter = require('./routes/existenceRoutes');
// const bookRouter = require('./routes/BACKUP_bookRoutes');

const app = express();

app.use(expressip().getIpInfoMiddleware);

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
// app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 500000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
// app.use(
  //   hpp({
//     whitelist: [
  //       'duration',
  //       'ratingsQuantity',
  //       'ratingsAverage',
  //       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

const BasriUtils = require('./utils/BasriUtils');
//BASRI - Custom Middleware!
//Simply logs/lists the keys of the req object :)
app.use((req, res, next) => {
  BasriUtils.BasriLogger(req, res);
  next();
});

//Compression
app.use(compression());

// 3) ROUTES
const whitelist = [
  'http://localhost:3000',
  'http://example2.com',
  'http://localhost:5000'
];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new AppError('Not allowed by CORS'));
    }
  }
};

app.use(cors());
// app.use(cors(corsOptions));
app.options('*', cors());
app.use('/api/v1/getipdetails', getIPDetailsRouter);
app.use('/api/v1/existence', existenceRouter);
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/books', bookRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
// redisTaskQueueProcessor

module.exports = app;
//NOT YET - Deployed Heroku
