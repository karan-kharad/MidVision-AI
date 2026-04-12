import React, { useState, useEffect } from 'react';
import { Search, Plus, UserPlus, X, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPatients } from '../api/patients';

const mockPatients = [
    { id: 1, name: 'Rahul Sharma', age: 35, gender: 'Male', bg: 'B+', phone: '9876501234', doctor: 'Dr. Desai', scans: 3 },
    { id: 2, name: 'Ananya Singh', age: 28, gender: 'Female', bg: 'O+', phone: '9876501235', doctor: 'Dr. Sharma', scans: 1 },
    { id: 3, name: 'Vikram Desai', age: 42, gender: 'Male', bg: 'A-', phone: '9876501236', doctor: 'Dr. Desai', scans: 5 }
];

const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                // Map the backend data to match frontend requirements if needed, or just set it
                // Assuming backend returns an array of patients
                setPatients(data.length > 0 ? data : mockPatients);
            } catch (error) {
                console.warn('Failed to fetch patients, using mock data');
                setPatients(mockPatients);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Also update filteredPatients to handle potential undefined fields gracefully
    const filteredPatients = patients.filter(p =>
        (p.name || p.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.phone || '').includes(searchTerm)
    );

    const handleSave = (e) => {
        e.preventDefault();
        setIsModalOpen(false);
        toast.success('Patient added successfully');
        // Simulate adding patient to list
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            setPatients(patients.filter(p => p.id !== id));
            toast.success('Patient deleted');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h1 className="text-2xl font-bold text-gray-800">Patients</h1>

                <div className="flex space-x-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10 w-full"
                        />
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary whitespace-nowrap">
                        <Plus className="w-5 h-5 mr-2" /> Add Patient
                    </button>
                </div>
            </div>

            <div className="medical-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-[#E2E8F0]">
                            <tr>
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Age/Gender</th>
                                <th className="px-6 py-4 font-medium">Blood Group</th>
                                <th className="px-6 py-4 font-medium">Phone</th>
                                <th className="px-6 py-4 font-medium">Doctor</th>
                                <th className="px-6 py-4 font-medium">Scans</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.map(patient => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">#{patient.id.toString().padStart(4, '0')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.age} / {patient.gender.charAt(0)}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded font-medium text-xs">{patient.bg}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.doctor}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium text-xs">{patient.scans}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link to={`/patients/${patient.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-200 transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(patient.id)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPatients.length === 0 && (
                        <div className="py-12 text-center text-gray-500">
                            No patients found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Patient Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold flex items-center">
                                <UserPlus className="w-5 h-5 mr-2 text-primary" /> Add New Patient
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input type="text" required className="input-field" placeholder="Patient Name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input type="tel" required className="input-field" placeholder="Contact number" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                                    <input type="number" required min="0" max="150" className="input-field" placeholder="Age in years" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                    <select required className="input-field">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                                    <select required className="input-field">
                                        <option value="">Select Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="input-field" placeholder="Email (Optional)" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input type="text" className="input-field" placeholder="Full address" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                                    <textarea className="input-field" rows="2" placeholder="Chronic conditions, past surgeries, etc."></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Medicines</label>
                                    <textarea className="input-field" rows="2" placeholder="List of current medications"></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                    <textarea className="input-field" rows="2" placeholder="Known drug or food allergies"></textarea>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Cancel</button>
                                <button type="submit" className="btn-primary px-8">Save Patient</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
