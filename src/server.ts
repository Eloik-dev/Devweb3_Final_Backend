import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import BaseRouter from './routes';
import HttpStatusCodes from './common/constants/HttpStatusCodes';
import { RouteError } from './common/util/route-errors';
import { NodeEnvs } from './common/constants';
import authenticateToken from './services/authenticateToken';
import cors from 'cors';
import StockRoutes from './routes/StockRoutes';
import Paths from 'tests/common/Paths';

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://api.justin.intebec.ca'];
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

if (NodeEnvs.Production) {
  app.use(helmet());
}

app.use(Paths.Base, BaseRouter);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (NodeEnvs.Dev) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

export default app;
