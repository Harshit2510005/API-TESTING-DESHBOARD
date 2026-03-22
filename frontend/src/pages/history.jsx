import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // हिस्ट्री स्टोर करने के लिए

  const data = {
    labels: ['10am', '11am', '12pm', '1pm', '2pm'],
    datasets: [{
      label: 'API Response Time (ms)',
      data: [120, 190, 300, 150, 200],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.2)',
      tension: 0.4,
    }]
  };

 const handleRunTest = async () => {
    if (!url) return alert("Please enter a URL");
    
    setLoading(true);
    const startTime = performance.now();

    try {
        const res = await fetch(url, { method: method });
        const result = await res.json();
        const endTime = performance.now();
        
        const newEntry = {
            id: Date.now(), // हर एंट्री के लिए एक यूनिक ID
            method: method,
            url: url,
            status: res.status,
            time: `${(endTime - startTime).toFixed(2)} ms`
        };

        setResponse(result); // नीचे आउटपुट बॉक्स के लिए
        setHistory(prev => [newEntry, ...prev]); // हिस्ट्री में सबसे ऊपर जोड़ें

    } catch (err) {
        console.error("Test Error:", err);
        setResponse({ error: "Network Error", message: err.message });
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] p-6 hidden md:block border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-10 text-sky-400">HAME API</h2>
        <nav className="space-y-4">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-lg cursor-pointer">📊 Dashboard</div>
          <div className="p-3 hover:bg-slate-700 rounded-lg cursor-pointer text-gray-400 transition">📜 History ({history.length})</div>
          <div className="p-3 hover:bg-slate-700 rounded-lg cursor-pointer text-gray-400 transition">⚙️ Settings</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">API Performance Monitor</h1>
          <button onClick={() => { localStorage.clear(); window.location.href='/'; }} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white transition">Logout</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* API Tester Card */}
            <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-gray-700">
              <h3 className="text-xl mb-4 text-gray-300">Test Your API</h3>
              <div className="flex gap-2">
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="bg-slate-800 border border-gray-600 rounded-lg px-3 outline-none">
                  <option>GET</option>
                  <option>POST</option>
                </select>
                <input type="text" placeholder="https://api.example.com" className="flex-1 bg-slate-800 border border-gray-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-500" value={url} onChange={(e) => setUrl(e.target.value)} />
                <button onClick={handleRunTest} disabled={loading} className="bg-sky-500 hover:bg-sky-600 px-6 py-2 rounded-lg font-bold transition">
                  {loading ? '...' : 'RUN'}
                </button>
              </div>
              <div className="mt-6 bg-black/60 p-5 rounded-xl font-mono text-sm text-green-400 h-48 overflow-auto border border-gray-800">
                <pre>{response ? JSON.stringify(response, null, 2) : "// Result will appear here..."}</pre>
              </div>
            </div>

            {/* History Table Section */}
            <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-gray-700">
              <h3 className="text-xl mb-4 text-gray-300">Recent Activity (History)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-500 border-b border-gray-700">
                    <tr>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">URL</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {history.length > 0 ? history.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-slate-800/50">
                        <td className="py-3 font-bold text-sky-400">{item.method}</td>
                        <td className="py-3 text-gray-400 truncate max-w-[200px]">{item.url}</td>
                        <td className="py-3"><span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs">{item.status}</span></td>
                        <td className="py-3 text-gray-300">{item.time}</td>
                      </tr>
                    )) : <tr><td colSpan="4" className="py-4 text-center text-gray-600">No history yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-gray-700 h-fit">
            <h3 className="text-xl mb-4 text-gray-300">Traffic Analysis</h3>
            <Line data={data} options={{ plugins: { legend: { display: false } } }} />
            <div className="mt-8 p-4 bg-sky-500/5 rounded-xl border border-sky-500/20">
              <p className="text-sky-400 font-bold">Status: Online</p>
              <p className="text-gray-500 text-xs mt-1">System is healthy. All services running.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;