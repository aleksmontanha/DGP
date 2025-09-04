'use client';
import React from 'react';

const NAV = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'instances', label: 'Instâncias' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'billing', label: 'Billing' },
  { key: 'projects', label: 'Projetos' },
  { key: 'users', label: 'Usuários' },
  { key: 'settings', label: 'Configurações' },
];

function useHashRoute(defaultKey = 'dashboard') {
  const [route, setRoute] = React.useState<string>(() =>
    typeof window !== 'undefined' && window.location.hash ? window.location.hash.replace('#/', '') : defaultKey
  );
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#/', '') || defaultKey);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [defaultKey]);
  function go(key: string) {
    if (typeof window !== 'undefined') window.location.hash = `#/${key}`;
    setRoute(key);
  }
  return { route, go };
}

async function fetchJSON(path: string, init?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const r = await fetch(`${base}${path}`, { cache: 'no-store', ...(init || {}) });
  return await r.json();
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="px-2 py-0.5 rounded-full text-xs border bg-white">{children}</span>;
}

function Card({ title, children, right }: any) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function TopStats() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">Instâncias</div><div className="text-2xl font-semibold">3</div></div>
      <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">GPUs</div><div className="text-2xl font-semibold">2</div></div>
      <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">Jobs</div><div className="text-2xl font-semibold">5</div></div>
      <div className="rounded-2xl border bg-white p-4"><div className="text-xs text-gray-500">Custo estimado (R$/h)</div><div className="text-2xl font-semibold">34,20</div></div>
    </div>
  );
}

function Row({ left, right }: any) {
  return (
    <div className="flex items-center justify-between text-sm py-2 border-b last:border-0">
      <div className="flex items-center gap-2">{left}</div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function InstancesPanel() {
  const [items, setItems] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', type: 'CPU.C4.small', vcpu: 4, ramGB: 8, gpus: 0 });

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchJSON('/instances');
      setItems(data);
      setLoading(false);
    })();
  }, []);

  async function createInstance() {
    const inst = await fetchJSON('/instances', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setItems((prev) => [inst, ...(prev || [])]);
  }

  async function action(id: string, act: 'start'|'stop'|'delete') {
    if (act === 'delete') {
      await fetchJSON(`/instances/${id}`, { method: 'DELETE' });
      setItems((prev) => (prev||[]).filter((x:any) => x.id !== id));
    } else {
      await fetchJSON(`/instances/${id}/${act}`, { method: 'POST' });
      const data = await fetchJSON('/instances');
      setItems(data);
    }
  }

  return (
    <Card title="Instâncias">
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2 text-xs">
          <input className="border rounded-lg px-2 py-1" placeholder="Nome" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="border rounded-lg px-2 py-1" placeholder="Tipo" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
          <input className="border rounded-lg px-2 py-1" type="number" placeholder="vCPU" value={form.vcpu} onChange={e=>setForm({...form, vcpu:Number(e.target.value)})} />
          <input className="border rounded-lg px-2 py-1" type="number" placeholder="RAM (GB)" value={form.ramGB} onChange={e=>setForm({...form, ramGB:Number(e.target.value)})} />
          <input className="border rounded-lg px-2 py-1" type="number" placeholder="GPUs" value={form.gpus} onChange={e=>setForm({...form, gpus:Number(e.target.value)})} />
        </div>
        <div className="flex justify-end">
          <button onClick={createInstance} className="px-3 py-1.5 text-sm border rounded-lg">Criar</button>
        </div>
        {loading && <div className="text-xs text-gray-500">Carregando...</div>}
        {(items || [
          { id: 'i-001', name: 'gpu-worker-01', status: 'running', vcpu: 16, ramGB: 64 },
          { id: 'i-002', name: 'cpu-worker-02', status: 'stopped', vcpu: 8, ramGB: 16 },
        ]).map((vm: any) => (
          <Row key={vm.id}
            left={<>
              <span className={`w-2 h-2 rounded-full ${vm.status==='running' ? 'bg-green-500' : vm.status==='provisioning' ? 'bg-amber-500' : 'bg-gray-300'}`} />
              <span className="font-medium">{vm.name}</span>
              <Pill>vCPU {vm.vcpu || '-'}</Pill>
              <Pill>RAM {vm.ramGB ? vm.ramGB+'GB' : '-'}</Pill>
            </>}
            right={<>
              {vm.status === 'running' ? (
                <button onClick={() => action(vm.id, 'stop')} className="px-2 py-1 text-xs border rounded-lg">Stop</button>
              ) : (
                <button onClick={() => action(vm.id, 'start')} className="px-2 py-1 text-xs border rounded-lg">Start</button>
              )}
              <button onClick={() => action(vm.id, 'delete')} className="px-2 py-1 text-xs border rounded-lg">Delete</button>
            </>}
          />
        ))}
      </div>
    </Card>
  );
}

function JobsPanel() {
  const [jobs, setJobs] = React.useState<any[] | null>(null);
  const [name, setName] = React.useState('llm-7b');

  React.useEffect(() => { (async () => setJobs(await fetchJSON('/jobs')))(); }, []);

  async function submitJob() {
    const j = await fetchJSON('/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    setJobs((prev) => [j, ...(prev || [])]);
  }

  return (
    <Card title="Jobs">
      <div className="flex gap-2 mb-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg px-2 py-1 text-sm flex-1" placeholder="Nome do job" />
        <button onClick={submitJob} className="px-3 py-1.5 text-sm border rounded-lg">Enviar</button>
      </div>
      <div className="space-y-1">
        {(jobs || [
          { id: 'job-101', name: 'vllm-7b', status: 'queued', submittedAt: new Date().toISOString() },
          { id: 'job-102', name: 'yolo-traffic', status: 'running', submittedAt: new Date().toISOString() },
        ]).map((j) => (
          <Row key={j.id}
            left={<>
              <span className={`w-2 h-2 rounded-full ${j.status==='running' ? 'bg-green-500' : j.status==='done' ? 'bg-gray-500' : 'bg-amber-500'}`} />
              <span className="font-medium">{j.name}</span>
              <Pill>{j.id}</Pill>
            </>}
            right={<span className="text-xs text-gray-600">{new Date(j.submittedAt).toLocaleString()}</span>}
          />
        ))}
      </div>
    </Card>
  );
}

function BillingPanel() {
  const [est, setEst] = React.useState<any | null>(null);
  const [spec, setSpec] = React.useState({ vcpu: 4, ramGB: 8, gpus: 0 });

  React.useEffect(() => { (async () => setEst(await fetchJSON('/billing/estimate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spec) })))(); }, []);
  async function recalc() {
    const e = await fetchJSON('/billing/estimate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spec) });
    setEst(e);
  }

  return (
    <Card title="Billing (MVP)">
      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
        <input className="border rounded-lg px-2 py-1" type="number" value={spec.vcpu} onChange={e=>setSpec({...spec, vcpu:Number(e.target.value)})} />
        <input className="border rounded-lg px-2 py-1" type="number" value={spec.ramGB} onChange={e=>setSpec({...spec, ramGB:Number(e.target.value)})} />
        <input className="border rounded-lg px-2 py-1" type="number" value={spec.gpus} onChange={e=>setSpec({...spec, gpus:Number(e.target.value)})} />
      </div>
      <button onClick={recalc} className="px-3 py-1.5 text-sm border rounded-lg">Recalcular</button>
      <div className="mt-3 text-sm text-gray-700">
        {est ? (<>
          <div>USD/h: <b>{est.usdPerHour.toFixed(4)}</b></div>
          <div>BRL/h: <b>{est.brlPerHour.toFixed(2)}</b></div>
        </>) : <span className="text-xs text-gray-500">Informe os campos e recalcule…</span>}
      </div>
    </Card>
  );
}

function Breadcrumb({ route }: { route: string }) {
  const current = NAV.find(n => n.key === route)?.label || 'Dashboard';
  return (
    <div className="text-sm text-gray-600">
      <span className="text-gray-400">Portal DGP</span>
      <span className="mx-2">/</span>
      <span className="font-medium text-gray-800">{current}</span>
    </div>
  );
}

function DashboardHome() {
  return (
    <div>
      <TopStats />
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <InstancesPanel />
        <JobsPanel />
        <BillingPanel />
      </div>
    </div>
  );
}

export default function PortalDGPApp() {
  const { route, go } = useHashRoute('dashboard');
  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-white">
        <div className="px-4 py-4 border-b flex items-center gap-2">
          <span className="inline-block w-8 h-8 rounded-2xl bg-black" />
          <div className="font-semibold">Portal DGP</div>
        </div>
        <nav className="p-2 space-y-1">
          {NAV.map(item => (
            <button key={item.key} onClick={() => go(item.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 ${route===item.key ? 'bg-gray-100 font-medium' : ''}`}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section>
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Breadcrumb route={route} />
            <div className="text-xs text-gray-600">Core MVP — navegação simulada</div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          {route === 'dashboard' && <DashboardHome />}
          {route === 'instances' && <InstancesPanel />}
          {route === 'jobs' && <JobsPanel />}
          {route === 'billing' && <BillingPanel />}
          {route === 'projects' && <Card title="Projetos"><div className="text-sm text-gray-600">Em breve…</div></Card>}
          {route === 'users' && <Card title="Usuários"><div className="text-sm text-gray-600">Em breve…</div></Card>}
          {route === 'settings' && <Card title="Configurações"><div className="text-sm text-gray-600">Em breve…</div></Card>}
        </main>
      </section>
    </div>
  );
}
