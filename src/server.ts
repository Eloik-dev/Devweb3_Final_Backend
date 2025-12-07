import morgan from "morgan";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";
import BaseRouter from "@src/routes";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { RouteError } from "@src/common/util/route-errors";
import { NodeEnvs } from "@src/common/constants";
import cors from "cors";
import Paths from "@src/common/constants/Paths";
import cookieParser from "cookie-parser";

import moduleAlias from "module-alias";

const isProd = process.env.NODE_ENV === "production";
const aliases = {
  "@src": isProd ? "dist" : "src",
};

moduleAlias.addAliases(aliases);

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "https://api.justin.intebec.ca", "https://justin.intebec.ca"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NodeEnvs.Dev) {
  app.use(morgan("dev"));
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
