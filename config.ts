/* eslint-disable n/no-process-env */

import path from 'path';
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';
import fs from 'fs';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

// Only load .env. files locally
if (!process.env.VERCEL) {
  const envPath = path.join(__dirname, `./config/.env.${NODE_ENV}`);

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.warn(`⚠️  Env file not found: ${envPath}`);
  }
} else {
  // On Vercel
  dotenv.config();
}

// Configure moduleAlias
if (__filename.endsWith('js')) {
  moduleAlias.addAlias('@src', __dirname + '/dist');
}
