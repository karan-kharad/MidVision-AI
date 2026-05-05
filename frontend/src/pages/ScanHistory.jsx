import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Loader2 } from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import SeverityBadge from '../components/SeverityBadge';
import { getScans } from '../api/scans';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
};

const mockScansHistory = [
    {
        id: 7,
        patient: "Rahul Sharma",
        type: "X-Ray",
        thumb: "https://images.unsplash.com/photo-1583324113626-d6b0bf5d4b8f?w=400&q=80",
        date: "12 Apr 2026, 10:30 AM",
        condition: "Forearm Fracture",
        confidence: 87,
        severity: "high",
        location: "Left forearm"
    },
    {
        id: 6,
        patient: "Ananya Singh",
        type: "MRI",
        thumb: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
        date: "10 Apr 2026, 02:15 PM",
        condition: "Normal",
        confidence: 96,
        severity: "normal",
        location: "Brain"
    },
    {
        id: 5,
        patient: "Vikram Desai",
        type: "CT Scan",
        thumb: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&q=80",
        date: "08 Apr 2026, 11:45 AM",
        condition: "Pleural Effusion",
        confidence: 72,
        severity: "medium",
        location: "Lungs"
    }
];

const ScanHistory = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedSeverity, setSelectedSeverity] = useState('All');
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sync with query param if it changes
        const query = searchParams.get('q');
        if (query !== null) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const data = await getScans();
                // Assumes backend returns an array of scans with proper fields or we map them.
                // We fallback to mock if API succeeds but returns nothing
                let fetchedScans = [];
                if (Array.isArray(data)) {
                    fetchedScans = data;
                } else if (data && Array.isArray(data.scans)) {
                    fetchedScans = data.scans;
                }

                setScans(fetchedScans.length > 0 ? fetchedScans : mockScansHistory);
            } catch (error) {
                console.warn('API getScans failed, using mock data');
                setScans(mockScansHistory);
            } finally {
                setLoading(false);
            }
        };
        fetchScans();
    }, []);

    const filteredScans = scans.filter(scan => {
        const patientName = scan.patient || scan.patient_name || '';
        const condition = scan.condition || (scan.ai_result && scan.ai_result.condition) || '';
        const severity = scan.severity || (scan.ai_result && scan.ai_result.severity) || 'normal';
        const type = scan.type || 'X-Ray';

        const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            condition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || type === selectedType;
        const matchesSeverity = selectedSeverity === 'All' || severity.toLowerCase() === selectedSeverity.toLowerCase();

        return matchesSearch && matchesType && matchesSeverity;
    });

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Scan History</h1>

            {/* Filters */}
            <div className="medical-card p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by patient or condition..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field !pl-12"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="input-field md:w-40"
                    >
                        <option value="All">All Types</option>
                        <option value="X-Ray">X-Ray</option>
                        <option value="MRI">MRI</option>
                        <option value="CT Scan">CT Scan</option>
                    </select>

                    <select
                        value={selectedSeverity}
                        onChange={(e) => setSelectedSeverity(e.target.value)}
                        className="input-field md:w-40"
                    >
                        <option value="All">All Severity</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                    </select>

                    <button className="btn-outline bg-gray-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 mr-2" /> Date Range
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScans.map(scan => (
                    <div key={scan.id} className="medical-card group">
                        <div className="h-48 overflow-hidden bg-black relative border-b border-[#E2E8F0]">
                            <img src={getImageUrl(scan.thumb || scan.image)} alt={scan.condition} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                            <div className="absolute top-3 right-3 text-2xl drop-shadow-md">
                                {scan.type === 'X-Ray' ? '🫁' : scan.type === 'MRI' ? '🧠' : '🫀'}
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <Link to={`/patients/1`} className="text-sm font-semibold text-primary hover:underline">{scan.patient || scan.patient_name || 'Unknown'}</Link>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight mt-1">{scan.condition || (scan.ai_result && scan.ai_result.condition) || 'Unknown Condition'}</h3>
                            </div>

                            <div className="flex items-center space-x-3">
                                <SeverityBadge severity={scan.severity || (scan.ai_result && scan.ai_result.severity) || 'normal'} />
                                <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">{scan.confidence || (scan.ai_result && scan.ai_result.confidence) || 0}% Conf.</span>
                            </div>

                            <div className="pt-4 border-t border-[#E2E8F0] flex justify-between items-center text-sm text-gray-600">
                                <span className="flex items-center">📍 {scan.location || (scan.ai_result && scan.ai_result.location) || 'Unknown'}</span>
                                <span>📅 {(scan.date || '').split(',')[0]}</span>
                            </div>

                            <Link to={`/scans/${scan.id}`} className="block w-full text-center btn-primary py-2 mt-2">
                                View Result
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredScans.length === 0 && (
                <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-[#E2E8F0]">
                    No scans match your current filters.
                </div>
            )}

            {/* Pagination (Visual only for representation) */}
            {filteredScans.length > 0 && (
                <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                        <button className="px-3 py-1 rounded bg-white border border-[#E2E8F0] text-gray-500 hover:bg-gray-50">Prev</button>
                        <button className="px-3 py-1 rounded bg-primary text-white">1</button>
                        <button className="px-3 py-1 rounded bg-white border border-[#E2E8F0] text-gray-700 hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 rounded bg-white border border-[#E2E8F0] text-gray-500 hover:bg-gray-50">Next</button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ScanHistory;
