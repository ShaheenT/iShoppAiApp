import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from '../server/api.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Mount both under /api and / so Vercel URL routing matches seamlessly
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
