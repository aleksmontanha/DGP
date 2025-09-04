import { Router } from 'express';

const router = Router();

type Instance = {
  id: string;
  name: string;
  type: string;
  vcpu: number;
  ramGB: number;
  gpus: number;
  status: 'running' | 'stopped' | 'provisioning';
  zone: string;
  priceUSDh: number;
};

let instances: Instance[] = [
  { id: 'i-001', name: 'gpu-worker-01', type: 'GPU.A10.large', vcpu: 16, ramGB: 64, gpus: 1, status: 'running', zone: 'edge-prk-01', priceUSDh: 0.55 },
  { id: 'i-002', name: 'cpu-worker-02', type: 'CPU.C8.medium', vcpu: 8,  ramGB: 16, gpus: 0, status: 'stopped', zone: 'edge-prk-01', priceUSDh: 0.06 },
  { id: 'i-003', name: 'gpu-worker-03', type: 'GPU.RTX4090.xl', vcpu: 32, ramGB: 128, gpus: 1, status: 'running', zone: 'edge-rivera-01', priceUSDh: 1.20 }
];

router.get('/', (_req, res) => { res.json(instances); });

router.post('/', (req, res) => {
  const { name, type, vcpu = 4, ramGB = 8, gpus = 0, zone = 'edge-default', priceUSDh = 0.05 } = req.body || {};
  const id = 'i-' + Math.random().toString(16).slice(2, 6);
  const inst: Instance = { id, name: name || id, type: type || 'CPU.C4.small', vcpu, ramGB, gpus, status: 'provisioning', zone, priceUSDh };
  instances.unshift(inst);
  res.json(inst);
});

router.post('/:id/start', (req, res) => {
  const i = instances.find(x => x.id === req.params.id);
  if (!i) return res.status(404).json({ error: 'not found' });
  i.status = 'running';
  res.json({ ok: true });
});

router.post('/:id/stop', (req, res) => {
  const i = instances.find(x => x.id === req.params.id);
  if (!i) return res.status(404).json({ error: 'not found' });
  i.status = 'stopped';
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  const before = instances.length;
  instances = instances.filter(x => x.id !== req.params.id);
  res.json({ removed: before - instances.length });
});

export default router;
