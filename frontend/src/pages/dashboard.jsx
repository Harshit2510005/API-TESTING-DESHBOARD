import React, { useState, useEffect } from 'react'; // useEffect को यहाँ जोड़ा गया है
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [chartStats, setChartStats] = useState([0, 0, 0, 0, 0]);

  // प्रोजेक्ट सेटिंग्स स्टेट
  const [projectSettings, setProjectSettings] = useState({
    name: "API Monitor Pro",
    devMode: true,
    frequency: "Real-time"
  });

  // पेज लोड होते ही localStorage से डेटा निकालें
  useEffect(() => {
    const savedHistory = localStorage.getItem('api_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // चार्ट का डेटा स्ट्रक्चर
  const chartData = {
    labels: ['T-4', 'T-3', 'T-2', 'T-1', 'Now'],
    datasets: [{
      label: 'API Speed (ms)',
      data: chartStats,
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.2)',
      tension: 0.4,
    }]
  };

  // API टेस्ट रन करने का फंक्शन
  const handleRunTest = async () => {
    if (!url) return alert("कृपया एक URL डालें!");
    setLoading(true);
    const startTime = performance.now();
    
    try {
      const res = await fetch(url, { 
        method: method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const endTime = performance.now();
      const timeTakenMs = parseFloat((endTime - startTime).toFixed(2));
      
      const rawText = await res.text();
      let result;
      try {
        result = rawText ? JSON.parse(rawText) : { message: 'Empty response body' };
      } catch (jsonErr) {
        result = { message: 'Response is not JSON format', text: rawText };
      }
      
      const newEntry = { 
        id: Date.now(), 
        method, 
        url, 
        status: res.status, 
        time: `${timeTakenMs} ms` 
      };

      // 1. स्टेट अपडेट करें
      const updatedHistory = [newEntry, ...history];
      setResponse(result);
      setHistory(updatedHistory);
      setChartStats(prev => [...prev.slice(1), timeTakenMs]);

      // 2. LocalStorage में सेव करें ताकि रिफ्रेश पर डेटा न जाए
      localStorage.setItem('api_history', JSON.stringify(updatedHistory));

      // Success notification
      if (res.status >= 200 && res.status < 300) {
        console.log("✅ API test successful!");
      }

    } catch (err) {
      // Better error handling
      let errorMessage = "Network Error: ";
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage += "Cannot connect to the API. Check if:\n• The URL is correct\n• CORS is enabled on the server\n• The server is running";
      } else if (err.message.includes('NetworkError')) {
        errorMessage += "Network connection failed. Check your internet.";
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
      
      const errorResponse = { 
        error: "Request Failed", 
        message: err.message,
        details: "Check console for more information"
      };
      
      setResponse(errorResponse);
      setChartStats(prev => [...prev.slice(1), 0]); 
      
      console.error("API Test Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // हिस्ट्री साफ करने का फंक्शन
  const clearHistory = () => {
    if (window.confirm("क्या आप पूरी हिस्ट्री डिलीट करना चाहते हैं?")) {
      setHistory([]);
      localStorage.removeItem('api_history');
      setChartStats([0, 0, 0, 0, 0]);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e293b] p-6 hidden md:block border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-10 text-sky-400">API TESTING</h2>
        <nav className="space-y-4">
          <div onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-lg cursor-pointer transition ${activeTab === 'dashboard' ? 'bg-sky-500/10 text-sky-400 font-bold' : 'text-gray-400 hover:bg-slate-700'}`}>📊 Dashboard</div>
          <div onClick={() => setActiveTab('history')} className={`p-3 rounded-lg cursor-pointer transition ${activeTab === 'history' ? 'bg-sky-500/10 text-sky-400 font-bold' : 'text-gray-400 hover:bg-slate-700'}`}>📜 History ({history.length})</div>
          <div onClick={() => setActiveTab('settings')} className={`p-3 rounded-lg cursor-pointer transition ${activeTab === 'settings' ? 'bg-sky-500/10 text-sky-400 font-bold' : 'text-gray-400 hover:bg-slate-700'}`}>⚙️ Settings</div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 md:mb-8 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-semibold capitalize truncate max-w-full">
            {activeTab === 'dashboard' ? projectSettings.name : activeTab}
          </h1>
          <button onClick={() => { localStorage.clear(); window.location.href='/'; }} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500 transition shadow-lg self-start sm:self-auto text-sm md:text-base">Logout</button>
        </header>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-gray-700">
                <h3 className="text-xl mb-4 text-gray-300 font-medium">Test Your API</h3>
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex gap-2 flex-1 w-full">
                    <select value={method} onChange={(e) => setMethod(e.target.value)} className="bg-slate-800 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 outline-none shrink-0"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>
                    <input type="text" className="flex-1 w-full bg-slate-800 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 outline-none focus:ring-2 focus:ring-sky-500 min-w-0" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/data" />
                  </div>
                  <button onClick={handleRunTest} disabled={loading} className="bg-sky-500 hover:bg-sky-600 px-6 py-2 rounded-lg font-bold transition shadow-lg shadow-sky-500/20 w-full lg:w-auto">{loading ? '...' : 'RUN'}</button>
                </div>
                <div className="mt-6 bg-black/60 p-5 rounded-xl text-green-400 h-64 overflow-auto border border-gray-800 font-mono">
                  <pre>{response ? JSON.stringify(response, null, 2) : "// Result output..."}</pre>
                </div>
              </div>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 h-fit text-center shadow-2xl">
              <h3 className="text-xl mb-4 text-gray-300">Traffic Analysis</h3>
              <div className="h-48"><Line data={chartData} options={{ maintainAspectRatio: false }} /></div>
              <div className="mt-4 text-4xl font-bold text-sky-400">Live</div>
            </div>
          </div>
        )}

        {/* --- HISTORY TAB --- */}
        {activeTab === 'history' && (
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border border-gray-700 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-gray-300 font-medium">Full Testing Logs</h3>
              <button onClick={clearHistory} className="text-red-400 border border-red-400/20 px-4 py-1 rounded hover:bg-red-500 hover:text-white transition">Clear All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-500 border-b border-gray-700 text-sm">
                  <tr><th className="py-2">METHOD</th><th>URL</th><th>STATUS</th><th>TIME</th></tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id} className="border-b border-gray-800 text-sm hover:bg-slate-800 transition">
                      <td className="py-4 text-sky-400 font-bold">{item.method}</td>
                      <td className="py-4 text-gray-400 truncate max-w-xs">{item.url}</td>
                      <td className="py-4"><span className={`px-2 py-1 rounded ${item.status < 400 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.status}</span></td>
                      <td className="py-4 text-gray-400">{item.time}</td>
                    </tr>
                  ))}
                  {history.length === 0 && <tr><td colSpan="4" className="py-10 text-center text-gray-500 italic">No history available.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-700 max-w-xl animate-fadeIn shadow-2xl">
            <h3 className="text-xl text-white mb-8 font-bold flex items-center gap-2">⚙️ Project Settings</h3>
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Project Name</p>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 p-3 rounded-lg border border-gray-700 focus:border-sky-500 outline-none transition"
                  value={projectSettings.name}
                  onChange={(e) => setProjectSettings({...projectSettings, name: e.target.value})}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-gray-700/50">
                <div>
                  <p className="font-semibold">Developer Mode</p>
                  <p className="text-xs text-gray-500">Show detailed error logs</p>
                </div>
                <button 
                  onClick={() => setProjectSettings({...projectSettings, devMode: !projectSettings.devMode})}
                  className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${projectSettings.devMode ? 'bg-sky-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${projectSettings.devMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Update Frequency</p>
                <select 
                  className="w-full bg-slate-800 p-3 rounded border border-gray-700 outline-none"
                  value={projectSettings.frequency}
                  onChange={(e) => setProjectSettings({...projectSettings, frequency: e.target.value})}
                >
                  <option>Real-time</option>
                  <option>Every 5 seconds</option>
                  <option>Manual only</option>
                </select>
              </div>
              <button 
                onClick={() => alert("Settings Saved Locally!")}
                className="bg-sky-500 hover:bg-sky-600 w-full py-4 rounded-xl font-bold transition shadow-lg shadow-sky-500/30 active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-gray-700 flex justify-around p-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 w-1/3 ${activeTab === 'dashboard' ? 'text-sky-400' : 'text-gray-400'}`}>
          <span className="text-xl">📊</span>
          <span className="text-[10px] sm:text-xs font-bold">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 w-1/3 ${activeTab === 'history' ? 'text-sky-400' : 'text-gray-400'}`}>
          <span className="text-xl">📜</span>
          <span className="text-[10px] sm:text-xs font-bold">History</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 w-1/3 ${activeTab === 'settings' ? 'text-sky-400' : 'text-gray-400'}`}>
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] sm:text-xs font-bold">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;