import { Router } from 'express';
const router = Router();

type Job = { id: string; name: string; status: 'queued'|'running'|'done'|'failed'; submittedAt: string };
let jobs: Job[] = [
  { id: 'job-101', name: 'vllm-7b', status: 'queued', submittedAt: new Date().toISOString() },
  { id: 'job-102', name: 'yolo-traffic', status: 'running', submittedAt: new Date().toISOString() }
];

router.get('/', (_req, res) => res.json(jobs));
router.post('/', (req, res) => {
  const { name } = req.body || {};
  const job: Job = { id: 'job-' + Math.random().toString(16).slice(2), name: name || 'job', status: 'queued', submittedAt: new Date().toISOString() };
  jobs.unshift(job);
  res.json(job);
});

export default router;
