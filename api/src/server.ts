import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import instances from './routes/instances';
import jobs from './routes/jobs';
import billing from './routes/billing';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/instances', instances);
app.use('/jobs', jobs);
app.use('/billing', billing);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log('API Portal DGP (core) on :' + port));
