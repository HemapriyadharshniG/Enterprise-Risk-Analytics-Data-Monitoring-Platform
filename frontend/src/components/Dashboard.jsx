import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Activity, AlertTriangle, TrendingUp, Layers } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

export default function Dashboard() {
  const [kpis, setKpis] = useState({ total_transactions: 0, avg_error_rate: 0, total_high_risk: 0 });
  const [deptRisk, setDeptRisk] = useState([]);
  const [riskTrends, setRiskTrends] = useState([]);
  const [severityDist, setSeverityDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, deptRes, trendsRes, severityRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/kpis'),
          axios.get('http://127.0.0.1:8000/api/department-risk'),
          axios.get('http://127.0.0.1:8000/api/risk-trends'),
          axios.get('http://127.0.0.1:8000/api/severity-distribution')
        ]);
        
        setKpis(kpiRes.data);
        setDeptRisk(deptRes.data);
        setRiskTrends(trendsRes.data);
        setSeverityDist(severityRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Enterprise Risk Analytics
          </h1>
          <p className="text-slate-400 mt-1">Real-time operational risk monitoring</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700/50 shadow-lg">
          <ShieldAlert className="text-blue-400 w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium tracking-wide">System Active</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl hover:bg-slate-800/60 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Total Transactions</h3>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Activity className="text-blue-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-bold tracking-tight">{kpis.total_transactions.toLocaleString()}</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl hover:bg-slate-800/60 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Avg Error Rate</h3>
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <TrendingUp className="text-orange-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-bold text-orange-400 tracking-tight">{(kpis.avg_error_rate * 100).toFixed(2)}%</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl hover:bg-slate-800/60 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-slate-400 font-medium">High Risk Events</h3>
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertTriangle className="text-red-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-4xl font-bold text-red-400 relative z-10 tracking-tight">{kpis.total_high_risk.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Dept Risk */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center mb-6">
            <Layers className="text-purple-400 w-5 h-5 mr-3" />
            <h3 className="text-lg font-semibold text-slate-200">Department Risk Comparison</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptRisk} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="dept_name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#334155', opacity: 0.3 }}
                />
                <Bar dataKey="high_risk_flag" name="High Risk Flags" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Pie */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
          <div className="flex items-center mb-6">
            <ShieldAlert className="text-indigo-400 w-5 h-5 mr-3" />
            <h3 className="text-lg font-semibold text-slate-200">Severity Distribution</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {severityDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Trend Line Chart */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl lg:col-span-2">
          <div className="flex items-center mb-6">
            <TrendingUp className="text-emerald-400 w-5 h-5 mr-3" />
            <h3 className="text-lg font-semibold text-slate-200">High Risk Trend (Monthly)</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="high_risk_flag" 
                  name="High Risk Flags" 
                  stroke="#ef4444" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: '#1e293b', stroke: '#ef4444', strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
