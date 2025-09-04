import axios from 'axios';
import https from 'https';

const baseURL = (process.env.PROXMOX_URL || 'https://127.0.0.1:8006') + '/api2/json';
const tokenId = process.env.PROXMOX_TOKEN_ID || '';
const tokenSecret = process.env.PROXMOX_TOKEN_SECRET || '';

export const prox = axios.create({
  baseURL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: { Authorization: 'PVEAPIToken ' + tokenId + '=' + tokenSecret },
});

export async function listQemu(node: string) {
  const { data } = await prox.get(`/nodes/${node}/qemu`);
  return data?.data || [];
}
export async function listLxc(node: string) {
  const { data } = await prox.get(`/nodes/${node}/lxc`);
  return data?.data || [];
}
export async function vmStatus(node: string, vmid: number) {
  const { data } = await prox.get(`/nodes/${node}/qemu/${vmid}/status/current`);
  return data?.data;
}
export async function vmStart(node: string, vmid: number) {
  const { data } = await prox.post(`/nodes/${node}/qemu/${vmid}/status/start`);
  return data?.data;
}
export async function vmStop(node: string, vmid: number) {
  const { data } = await prox.post(`/nodes/${node}/qemu/${vmid}/status/stop`);
  return data?.data;
}
