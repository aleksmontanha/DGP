import { Router } from 'express';

const router = Router();

const PRICES = {
  CPU_vCPU: 0.02,  // USD/h por vCPU
  RAM_GB:   0.005, // USD/h por GB
  GPU_unit: 1.0    // USD/h por GPU
};

router.get('/prices', (_req, res) => res.json(PRICES));

router.post('/estimate', (req, res) => {
  const { vcpu = 4, ramGB = 8, gpus = 0 } = req.body || {};
  const usdPerHour = vcpu * PRICES.CPU_vCPU + ramGB * PRICES.RAM_GB + gpus * PRICES.GPU_unit;
  res.json({ usdPerHour, brlPerHour: usdPerHour * 5.4 });
});

export default router;
