import { Router } from 'express';
import { listQemu, listLxc, vmStart, vmStop, vmStatus } from '../proxmox';

const router = Router();
const NODE = process.env.PROXMOX_NODE || 'pve';

router.get('/vms', async (_req, res) => {
  try { res.json(await listQemu(NODE)); } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.get('/lxc', async (_req, res) => {
  try { res.json(await listLxc(NODE)); } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post('/vm/:vmid/start', async (req, res) => {
  try { res.json(await vmStart(NODE, Number(req.params.vmid)) || { ok: true }); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post('/vm/:vmid/stop', async (req, res) => {
  try { res.json(await vmStop(NODE, Number(req.params.vmid)) || { ok: true }); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.get('/vm/:vmid/status', async (req, res) => {
  try { res.json(await vmStatus(NODE, Number(req.params.vmid))); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
