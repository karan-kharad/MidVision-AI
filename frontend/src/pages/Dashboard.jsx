import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, FileImage, Bone, FileText, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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

    const [barData, setBarData] = useState([
        { name: 'Mon', scans: 0 },
        { name: 'Tue', scans: 0 },
        { name: 'Wed', scans: 0 },
        { name: 'Thu', scans: 0 },
        { name: 'Fri', scans: 0 },
        { name: 'Sat', scans: 0 },
        { name: 'Sun', scans: 0 },
    ]);

    const [pieData, setPieData] = useState([
        { name: 'High', value: 0, color: '#EF4444' },
        { name: 'Medium', value: 0, color: '#F59E0B' },
        { name: 'Low', value: 0, color: '#FCD34D' },
        { name: 'Normal', value: 0, color: '#10B981' },
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

                // Calculate stats
                const fractures = scans.filter(s => s.fracture_detected || s.ai_fracture_detected).length;
                setStats({
                    totalPatients: patientsList.length,
                    totalScans: scans.length,
                    fractures: fractures,
                    reports: scans.filter(s => s.status === 'completed').length
                });

                // Calculate Pie Data
                const severityCounts = { high: 0, medium: 0, low: 0, normal: 0 };
                scans.forEach(s => {
                    const sev = (s.severity || s.ai_severity || 'normal').toLowerCase();
                    if (severityCounts[sev] !== undefined) severityCounts[sev]++;
                    else severityCounts.normal++;
                });

                setPieData([
                    { name: 'High', value: severityCounts.high, color: '#EF4444' },
                    { name: 'Medium', value: severityCounts.medium, color: '#F59E0B' },
                    { name: 'Low', value: severityCounts.low, color: '#FCD34D' },
                    { name: 'Normal', value: severityCounts.normal, color: '#10B981' },
                ]);

                // Mock bar data distribution based on real scan count for visual effect
                if (scans.length > 0) {
                   const newBarData = barData.map(d => ({...d, scans: Math.floor(Math.random() * scans.length)}));
                   setBarData(newBarData);
                }

            } catch (err) {
                console.error('Could not fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);


    const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
        <div className="medical-card p-6 border-l-4" style={{ borderLeftColor: 'var(--color-primary)' }}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-xl flex items-center justify-center`}>
                    {<Icon />}
                </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 flex items-center">
                {subtext}
            </p>
        </div>
    );

    if (loading) return <div className="p-8 text-center">Loading dashboard data...</div>;

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value={stats.totalPatients} subtext="👤 Overall registered" icon={Users} colorClass="text-blue-600 bg-blue-100" />
                <StatCard title="Total Scans" value={stats.totalScans} subtext="🩻 Across all patients" icon={FileImage} colorClass="text-purple-600 bg-purple-100" />
                <StatCard title="Fractures Detected" value={stats.fractures} subtext="🦴 AI identified" icon={Bone} colorClass="text-red-600 bg-red-100" />
                <StatCard title="Reports Ready" value={stats.reports} subtext="📋 Analysis completed" icon={FileText} colorClass="text-green-600 bg-green-100" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="medical-card p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Scans Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="scans" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="medical-card p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Severity Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="hidden sm:flex flex-col space-y-2 translate-x-32 text-sm">
                            {pieData.map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-gray-600">{item.name} ({item.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="medical-card p-0 flex flex-col">
                    <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Scans</h3>
                        <Link to="/scans" className="text-sm font-medium text-primary hover:text-blue-700 flex items-center">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Patient</th>
                                    <th className="px-5 py-3 font-medium">Condition</th>
                                    <th className="px-5 py-3 font-medium">Severity</th>
                                    <th className="px-5 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentScans.length > 0 ? recentScans.map(scan => (
                                    <tr key={scan.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 font-medium text-gray-900">{scan.patient}</td>
                                        <td className="px-5 py-3 text-gray-600">{scan.ai_result?.condition || scan.condition || 'Analyzing...'}</td>
                                        <td className="px-5 py-3"><SeverityBadge severity={scan.ai_result?.severity || scan.severity || 'normal'} /></td>
                                        <td className="px-5 py-3 text-right">
                                            <Link to={`/scans/${scan.id}`} className="text-primary hover:underline font-medium">View</Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-8 text-center text-gray-500">No recent scans found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="medical-card p-0 flex flex-col">
                    <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Recent Patients</h3>
                        <Link to="/patients" className="text-sm font-medium text-primary hover:text-blue-700 flex items-center">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Name</th>
                                    <th className="px-5 py-3 font-medium">Age/Gender</th>
                                    <th className="px-5 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentPatients.length > 0 ? recentPatients.map(patient => (
                                    <tr key={patient.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 font-medium text-gray-900"><Link to={`/patients/${patient.id}`}>{patient.full_name || patient.name}</Link></td>
                                        <td className="px-5 py-3 text-gray-600">{patient.age} / {(patient.gender || '').charAt(0)}</td>
                                        <td className="px-5 py-3 text-right">
                                            <Link to={`/patients/${patient.id}`} className="text-primary hover:underline font-medium">Profile</Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-5 py-8 text-center text-gray-500">No recent patients found.</td>
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
