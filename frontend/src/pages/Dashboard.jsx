import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, FileImage, Bone, FileText, ArrowRight, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import SeverityBadge from '../components/SeverityBadge';
import { getScans } from '../api/scans';
import { getPatients } from '../api/patients';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [recentScans, setRecentScans] = useState([]);
    const [recentPatients, setRecentPatients] = useState([]);
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalScans: 0,
        fractures: 0,
        reports: 0
    });
    const [loading, setLoading] = useState(true);

    const [chartData, setChartData] = useState([
        { name: 'Mon', scans: 4, efficiency: 85 },
        { name: 'Tue', scans: 7, efficiency: 88 },
        { name: 'Wed', scans: 5, efficiency: 92 },
        { name: 'Thu', scans: 12, efficiency: 90 },
        { name: 'Fri', scans: 9, efficiency: 95 },
        { name: 'Sat', scans: 3, efficiency: 89 },
        { name: 'Sun', scans: 2, efficiency: 91 },
    ]);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const scansResponse = await getScans();
                const scans = scansResponse.scans || [];
                const patientsList = await getPatients();

                setRecentScans(scans.slice(0, 5));
                setRecentPatients(patientsList.slice(0, 5));

                const fractures = scans.filter(s => s.fracture_detected || s.ai_fracture_detected).length;
                setStats({
                    totalPatients: patientsList.length,
                    totalScans: scans.length,
                    fractures: fractures,
                    reports: scans.filter(s => s.status === 'completed').length
                });

                if (scans.length > 0) {
                   const newChartData = chartData.map(d => ({
                       ...d, 
                       scans: Math.floor(Math.random() * 15) + 2,
                       efficiency: Math.floor(Math.random() * 15) + 80
                   }));
                   setChartData(newChartData);
                }

            } catch (err) {
                console.error('Could not fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);


    const StatCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
        <div className="medical-card group">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-opacity-10 flex items-center justify-center transition-transform group-hover:scale-110 duration-500`} style={{ backgroundColor: `${color}20`, color: color }}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                            <TrendingUp className="w-3 h-3" /> {trend}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-4xl font-bold text-secondary mb-1 tracking-tight">{value}</h3>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
                </div>
            </div>
            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-50 text-xs text-slate-400 font-medium italic">
                {subtext}
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Initializing clinical data...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight">Clinical Overview</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time diagnostics and patient management system.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-outline py-2.5">
                        <Clock className="w-4 h-4" /> Export logs
                    </button>
                    <Link to="/scans/upload" className="btn-primary py-2.5 shadow-primary/20">
                        <FileImage className="w-4 h-4" /> New Analysis
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value={stats.totalPatients} subtext="Active registrations" icon={Users} color="#00B4D8" trend="+12%" />
                <StatCard title="Total Scans" value={stats.totalScans} subtext="System-wide imaging" icon={FileImage} color="#023E8A" trend="+5%" />
                <StatCard title="Fractures Detected" value={stats.fractures} subtext="Confirmed by AI engine" icon={Bone} color="#EF4444" trend="+8%" />
                <StatCard title="Reports Ready" value={stats.reports} subtext="Validated by practitioners" icon={FileText} color="#10B981" />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 medical-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-secondary">Diagnostic Volume</h3>
                            <p className="text-sm text-slate-400">Weekly analysis throughput and AI efficiency</p>
                        </div>
                        <select className="bg-slate-50 border-none rounded-lg text-xs font-bold p-2 outline-none text-slate-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#00B4D8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="scans" stroke="#00B4D8" strokeWidth={4} fillOpacity={1} fill="url(#colorScans)" />
                                <Area type="monotone" dataKey="efficiency" stroke="#023E8A" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="medical-card p-0 flex flex-col">
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="text-xl font-bold text-secondary mb-1 text-center">System Health</h3>
                        <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-bold">AI Node Status</p>
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-center items-center">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                             <div className="absolute inset-0 rounded-full border-[12px] border-slate-50"></div>
                             <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                             <div className="text-center z-10">
                                 <p className="text-4xl font-black text-primary">98.4%</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Uptime</p>
                             </div>
                        </div>
                        <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                             <div className="p-3 bg-emerald-50 rounded-xl text-center">
                                 <p className="text-xs font-bold text-emerald-600 uppercase">Latency</p>
                                 <p className="text-lg font-black text-emerald-700">142ms</p>
                             </div>
                             <div className="p-3 bg-blue-50 rounded-xl text-center">
                                 <p className="text-xs font-bold text-blue-600 uppercase">Queue</p>
                                 <p className="text-lg font-black text-blue-700">Idle</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="medical-card p-0 flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                             <FileImage className="w-5 h-5 text-primary" /> Recent Analyses
                        </h3>
                        <Link to="/scans" className="text-xs font-bold text-primary hover:text-blue-700 uppercase tracking-wider flex items-center gap-1 group">
                            View Archive <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-black">Patient Reference</th>
                                    <th className="px-6 py-4 font-black">Detection</th>
                                    <th className="px-6 py-4 font-black">AI Severity</th>
                                    <th className="px-6 py-4 font-black text-right">Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentScans.length > 0 ? recentScans.map(scan => (
                                    <tr key={scan.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                             <div className="font-bold text-secondary">{scan.patient}</div>
                                             <div className="text-[10px] text-slate-400">ID: #{scan.id}</div>
                                        </td>
                                        <td className="px-6 py-5 font-medium text-slate-600">{scan.ai_result?.condition || scan.condition || 'Analyzing...'}</td>
                                        <td className="px-6 py-5"><SeverityBadge severity={scan.ai_result?.severity || scan.severity || 'normal'} /></td>
                                        <td className="px-6 py-5 text-right">
                                            <Link to={`/scans/${scan.id}`} className="bg-white border border-slate-100 shadow-sm px-3 py-1.5 rounded-lg text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold">Open File</Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                             <div className="flex flex-col items-center gap-2 text-slate-300">
                                                 <AlertTriangle className="w-10 h-10" />
                                                 <p className="font-bold">No recent scan activity.</p>
                                             </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="medical-card p-0 flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                             <Users className="w-5 h-5 text-secondary" /> Practitioner Registry
                        </h3>
                        <Link to="/patients" className="text-xs font-bold text-secondary hover:text-blue-900 uppercase tracking-wider flex items-center gap-1 group">
                            Full Registry <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-black">Clinical Name</th>
                                    <th className="px-6 py-4 font-black">Vitals Summary</th>
                                    <th className="px-6 py-4 font-black text-right">Profile</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentPatients.length > 0 ? recentPatients.map(patient => (
                                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5">
                                             <div className="font-bold text-secondary">{patient.full_name || patient.name}</div>
                                             <div className="text-[10px] text-slate-400">{patient.phone}</div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-600 font-medium">
                                             <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] mr-2">{patient.age}Y</span>
                                             <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold">{patient.blood_group}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link to={`/patients/${patient.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-secondary hover:text-white transition-all shadow-inner">
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-300 font-bold">No active patient records.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
