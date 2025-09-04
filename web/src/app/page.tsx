export default function Home() {
  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">Visão geral dos serviços e recursos</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-sm">Criar recurso</button>
          <button className="border rounded px-3 py-2 text-sm">Ações</button>
        </div>
      </div>

      {/* Quick actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Instâncias</div>
            <div className="text-2xl font-bold">12</div>
          </div>
          <div className="text-gray-400">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Jobs</div>
            <div className="text-2xl font-bold">3</div>
          </div>
          <div className="text-gray-400">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Faturamento (mês)</div>
            <div className="text-2xl font-bold">R$ 1.240,00</div>
          </div>
          <div className="text-gray-400">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { name: "EC2-like", desc: "Gerencie instâncias" },
          { name: "Jobs", desc: "Tarefas e pipelines" },
          { name: "Storage", desc: "Volumes e snapshots" },
          { name: "Billing", desc: "Faturas e planos" },
        ].map((s) => (
          <div key={s.name} className="bg-white rounded shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
              <div className="text-gray-400">▸</div>
            </div>
          </div>
        ))}
      </section>

      {/* Resource table (mock) */}
      <section className="bg-white rounded shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Instâncias recentes</h2>
          <div className="text-sm text-gray-500">Mostrando 10 itens</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">ID</th>
                <th className="py-2">Nome</th>
                <th className="py-2">Status</th>
                <th className="py-2">Região</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3">i-00{i}abcd</td>
                  <td className="py-3">app-server-{i}</td>
                  <td className="py-3 text-sm text-green-600">Running</td>
                  <td className="py-3">sa-east-1</td>
                  <td className="py-3 text-blue-600">Ver</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
