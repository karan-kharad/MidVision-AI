import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Calendar, Activity, UploadCloud, ChevronRight, Edit2 } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import { getPatient } from '../api/patients';
import { getPatientScans } from '../api/scans';

const mockPatient = {
    id: 1,
    full_name: "Rahul Sharma",
    age: 35,
    gender: "Male",
    blood_group: "B+",
    phone: "+91 98765 01234",
    email: "rahul.s@example.com",
    address: "123 Health Ave, Mumbai, MH",
    medical_history: "No previous fractures. Mild hypertension.",
    current_medicines: "Amlodipine 5mg",
    allergies: "Penicillin",
    assigned_doctor: "Dr. Anjali Desai",
    patient_since: "01 Jan 2026",
};

const mockScans = [
    {
        id: 7,
        type: "X-Ray",
        icon: "🫁",
        date: "12 Apr 2026, 10:30 AM",
        condition: "Forearm Fracture",
        confidence: 87,
        severity: "high"
    },
    {
        id: 4,
        type: "MRI",
        icon: "🧠",
        date: "15 Feb 2026, 09:15 AM",
        condition: "Normal Brain Scan",
        confidence: 99,
        severity: "normal"
    }
];

const PatientDetail = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const patientData = await getPatient(id);
                setPatient(patientData);
            } catch (err) {
                console.warn('API getPatient failed, using mock data');
                setPatient(mockPatient);
            }

            try {
                const scansData = await getPatientScans(id);
                setScans(scansData.length > 0 ? scansData : mockScans);
            } catch (err) {
                console.warn('API getPatientScans failed, using mock data');
                setScans(mockScans);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link to="/patients" className="hover:text-primary transition-colors">Patients</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-gray-900 font-medium">{patient.full_name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transform items-start">
                {/* Left Column — Patient Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="medical-card">
                        <div className="bg-primary bg-opacity-5 p-6 flex flex-col items-center border-b border-[#E2E8F0]">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl text-primary font-bold shadow-sm mb-4 border-4 border-white">
                                {patient.full_name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{patient.full_name}</h2>
                            <p className="text-gray-500 mb-4">Patient #{id.toString().padStart(4, '0')}</p>

                            <div className="flex space-x-2 w-full justify-center">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">{patient.age} yrs</span>
                                <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-semibold">{patient.gender}</span>
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">{patient.blood_group}</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Info</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <Phone className="w-4 h-4 mr-3 text-gray-400" /> {patient.phone}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <Mail className="w-4 h-4 mr-3 text-gray-400" /> {patient.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <MapPin className="w-4 h-4 mr-3 text-gray-400" /> {patient.address}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-[#E2E8F0]" />

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Medical Details</h4>
                                <div className="space-y-4">
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-1">Medical History</span>
                                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{patient.medical_history}</p>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-1">Current Medicines</span>
                                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{patient.current_medicines}</p>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500 mb-1">Allergies</span>
                                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded font-medium">{patient.allergies}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-[#E2E8F0]" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Assigned Doctor:</span>
                                    <span className="font-medium text-gray-900">{patient.assigned_doctor}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Patient Since:</span>
                                    <span className="font-medium text-gray-900">{patient.patient_since}</span>
                                </div>
                            </div>

                            <button className="w-full mt-4 btn-outline py-2">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column — Scan History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0]">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Scan History</h3>
                            <p className="text-sm text-gray-500">{scans.length} scans total</p>
                        </div>
                        <Link to="/scans/upload" className="btn-primary">
                            <UploadCloud className="w-5 h-5 mr-2" /> Upload New Scan
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {scans.map(scan => (
                            <div key={scan.id} className="medical-card p-5 hover:border-blue-300 transition-colors cursor-default">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                            {scan.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h4 className="text-lg font-bold text-gray-900">{scan.condition}</h4>
                                                <SeverityBadge severity={scan.severity} />
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                <span className="flex items-center"><Activity className="w-4 h-4 mr-1" /> {scan.type} Scan</span>
                                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {scan.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/scans/${scan.id}`} className="btn-outline text-sm py-1.5 px-4 bg-gray-50">
                                        View Result
                                    </Link>
                                </div>

                                <div className="mt-5 w-full md:w-1/2">
                                    <ConfidenceBar confidence={scan.confidence} severity={scan.severity} />
                                </div>
                            </div>
                        ))}

                        {scans.length === 0 && (
                            <div className="medical-card p-12 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Activity className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">No scans available</h4>
                                <p className="text-gray-500 mt-2">Upload a scan to jumpstart diagnosis.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;
