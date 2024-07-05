import { config } from 'dotenv';
import path from 'path';

// initializing dotenv
const envPath: string = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'test' ? '../../../.env.test' : '../../../../.env',
);

config({ path: envPath });
