import logger from "jet-logger";

import ENV from "@src/common/constants/ENV";
import server from "@src/server";
import { connect } from "mongoose";

const SERVER_START_MSG = "Express server started on port: " + ENV.Port.toString();

connect(ENV.Mongodb)
  .then(() => {
    server.listen(ENV.Port, () => logger.info(SERVER_START_MSG));
  })
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    logger.err("Erreur de connexion MongoDB: " + message);
  });
