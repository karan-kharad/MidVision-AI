import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, FileImage, Bone, FileText, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import SeverityBadge from '../components/SeverityBadge';
import { getScans } from '../api/scans';
import { getPatients } from '../api/patients';

const barData = [
    { name: 'Mon', scans: 4 },
    { name: 'Tue', scans: 7 },
    { name: 'Wed', scans: 5 },
    { name: 'Thu', scans: 10 },
    { name: 'Fri', scans: 8 },
    { name: 'Sat', scans: 3 },
    { name: 'Sun', scans: 2 },
];

const pieData = [
    { name: 'High', value: 15, color: '#EF4444' },
    { name: 'Medium', value: 25, color: '#F59E0B' },
    { name: 'Low', value: 20, color: '#FCD34D' },
    { name: 'Normal', value: 40, color: '#10B981' },
];

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [recentScans, setRecentScans] = useState([
        { id: 1, patient: 'Rahul Sharma', condition: 'Forearm Fracture', severity: 'high' },
        { id: 2, patient: 'Priya Patel', condition: 'Normal', severity: 'normal' }
    ]);
    const [recentPatients, setRecentPatients] = useState([
        { id: 1, name: 'Rahul Sharma', age: 35, gender: 'M', lastScan: '12 Apr 2026' },
        { id: 2, name: 'Ananya Singh', age: 28, gender: 'F', lastScan: '10 Apr 2026' }
    ]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const scans = await getScans();
                if (scans.length > 0) setRecentScans(scans.slice(0, 5));
            } catch (err) {
                console.warn('Could not fetch scans for dashboard');
            }
            try {
                const patientsList = await getPatients();
                if (patientsList.length > 0) setRecentPatients(patientsList.slice(0, 5));
            } catch (err) {
                console.warn('Could not fetch patients for dashboard');
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

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Patients" value="24" subtext="👤 +3 today" icon={Users} colorClass="text-blue-600 bg-blue-100" />
                <StatCard title="Total Scans Today" value="8" subtext="🩻 this week" icon={FileImage} colorClass="text-purple-600 bg-purple-100" />
                <StatCard title="Fractures Detected" value="5" subtext="🦴 this month" icon={Bone} colorClass="text-red-600 bg-red-100" />
                <StatCard title="Reports Generated" value="12" subtext="📋 total" icon={FileText} colorClass="text-green-600 bg-green-100" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="medical-card p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Scans per Day (Last 7 Days)</h3>
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
                        <div className="absolute flex flex-col space-y-2 translate-x-32 text-sm">
                            {pieData.map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-gray-600">{item.name}</span>
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
                                    <th className="px-5 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentScans.map(scan => {
                                    const patientName = scan.patient || scan.patient_name || 'Unknown';
                                    const condition = scan.condition || (scan.ai_result && scan.ai_result.condition) || 'Unknown';
                                    const severity = scan.severity || (scan.ai_result && scan.ai_result.severity) || 'normal';

                                    return (
                                        <tr key={scan.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 font-medium text-gray-900">{patientName}</td>
                                            <td className="px-5 py-3 text-gray-600">{condition}</td>
                                            <td className="px-5 py-3"><SeverityBadge severity={severity} /></td>
                                            <td className="px-5 py-3">
                                                <Link to={`/scans/${scan.id}`} className="text-primary hover:underline font-medium">View</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                    <th className="px-5 py-3 font-medium">Last Scan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentPatients.map(patient => (
                                    <tr key={patient.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 font-medium text-gray-900 cursor-pointer hover:text-primary"><Link to={`/patients/${patient.id}`}>{patient.name || patient.full_name}</Link></td>
                                        <td className="px-5 py-3 text-gray-600">{patient.age} / {(patient.gender || '').charAt(0)}</td>
                                        <td className="px-5 py-3 text-gray-600">{patient.lastScan || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
