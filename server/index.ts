import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import nocache from 'nocache';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import router from './router';

import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';

const app: express.Application = express();

const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
});
app.use(limiter);

app.disable('x-powered-by');

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ['"none"'],
        'frame-ancestors': ['"none"'],
      },
    },
    frameguard: {
      action: 'deny',
    },
  })
);
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(nocache());

app.use((req, res, next) => {
  res.contentType('application/json; charset=utf-8');
  res.header("Access-Control-Allow-Origin", `http://localhost:${process.env.PORT}`);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('json spaces', 2);

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
    credentials: true,
  })
);

app.use(compression());

app.use(router);

app.use(errorHandler);
app.use(notFoundHandler);

export {
  app
};
