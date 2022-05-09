import dotenv from 'dotenv';
import { createServer } from './server';
import { createAPI } from './api';
import { startListener } from './listener';

dotenv.config();

const app = createAPI();

createServer(app);
startListener();
