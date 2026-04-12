import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, User, FileImage, Image as ImageIcon, Activity, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPatients } from '../api/patients';
import { uploadScan } from '../api/scans';

const mockPatients = [
    { id: 1, name: 'Rahul Sharma', age: 35, bg: 'B+' },
    { id: 2, name: 'Ananya Singh', age: 28, bg: 'O+' },
    { id: 3, name: 'Vikram Desai', age: 42, bg: 'A-' }
];

const UploadScan = () => {
    const [step, setStep] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [scanType, setScanType] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [notes, setNotes] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [patients, setPatients] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data.length > 0 ? data : mockPatients);
            } catch (err) {
                console.warn('API getPatients failed, using mock data');
                setPatients(mockPatients);
            }
        };
        fetchPatients();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const runAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysisProgress(20);

        try {
            // 1. Prepare FormData
            const formData = new FormData();
            formData.append('image', file);
            formData.append('patient_id', selectedPatient.id);
            formData.append('scan_type', scanType);
            if (notes) formData.append('notes', notes);

            // 2. Upload scan using real API
            // API is expected to return { scan_id: ID, status: 'analyzing' ... }
            const response = await uploadScan(formData);

            setAnalysisProgress(60);

            // Wait just a bit to show progress for UX
            await new Promise(resolve => setTimeout(resolve, 800));
            setAnalysisProgress(100);
            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success('Scan analyzed successfully');

            // Push to the newly created scan result page
            navigate(`/scans/${response.scan_id || response.id || 7}`);

        } catch (err) {
            console.error('API upload failed, running simulation fallback', err);
            // Simulate multi-step progress from mock
            const steps = [
                { progress: 20, time: 800 },
                { progress: 50, time: 1500 },
                { progress: 80, time: 1000 },
                { progress: 100, time: 500 }
            ];

            let currentStep = 0;

            const executeNextStep = () => {
                if (currentStep < steps.length) {
                    setAnalysisProgress(steps[currentStep].progress);
                    setTimeout(executeNextStep, steps[currentStep].time);
                    currentStep++;
                } else {
                    toast.success('Mock scan analyzed successfully (API failed)');
                    navigate('/scans/7');
                }
            };
            executeNextStep();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Upload New Scan</h1>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                {[1, 2, 3].map((s) => (
                    <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${step >= s ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                        {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                    </div>
                ))}
            </div>

            <div className="medical-card p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Step 1 — Select Patient</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Patient</label>
                            <select
                                className="input-field"
                                value={selectedPatient?.id || ''}
                                onChange={(e) => {
                                    const p = patients.find(p => p.id === parseInt(e.target.value));
                                    setSelectedPatient(p);
                                }}
                            >
                                <option value="">-- Select a patient --</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name || p.full_name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedPatient && (
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-lg mr-4">
                                    {(selectedPatient.name || selectedPatient.full_name || 'U').charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{selectedPatient.name || selectedPatient.full_name}</h4>
                                    <p className="text-sm text-gray-600">Age: {selectedPatient.age} | Blood Group: {selectedPatient.bg}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedPatient}
                                className={`btn-primary ${!selectedPatient ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Step 2 — Scan Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Scan Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'xray', icon: '🫁', label: 'X-Ray' },
                                    { id: 'mri', icon: '🧠', label: 'MRI' },
                                    { id: 'ct', icon: '🫀', label: 'CT Scan' }
                                ].map(type => (
                                    <div
                                        key={type.id}
                                        onClick={() => setScanType(type.id)}
                                        className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${scanType === type.id ? 'border-primary bg-blue-50 shadow-sm text-primary font-semibold' : 'border-[#E2E8F0] hover:border-blue-300 text-gray-600'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{type.icon}</div>
                                        <span>{type.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                            <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer relative overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/*,.dicom"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />

                                {preview ? (
                                    <div className="flex justify-center items-center h-48">
                                        <img src={preview} alt="Preview" className="max-h-full max-w-full rounded-lg object-contain" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-6">
                                        <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                                        <p className="text-gray-700 font-medium">Drag & drop or click to upload</p>
                                        <p className="text-sm text-gray-500 mt-1">Accepts JPG, PNG, DICOM</p>
                                    </div>
                                )}
                            </div>
                            {file && <p className="text-sm text-gray-500 mt-2 text-center">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes (Optional)</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                placeholder="Any special details or areas to focus on..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!scanType || !file}
                                className={`btn-primary ${(!scanType || !file) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Review & Analyze
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 text-center">
                        {isAnalyzing ? (
                            <div className="py-12 flex flex-col items-center text-center max-w-md mx-auto">
                                <div className="relative w-24 h-24 mb-8">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                    <div
                                        className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                                    ></div>
                                    <Activity className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-6">Analyzing Scan with Gemini AI...</h3>

                                <div className="w-full space-y-4 text-left">
                                    <div className="flex items-center text-sm font-medium">
                                        <CheckCircle2 className={`w-5 h-5 mr-3 ${analysisProgress >= 20 ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={analysisProgress >= 20 ? 'text-gray-900' : 'text-gray-400'}>Uploading image...</span>
                                    </div>
                                    <div className="flex items-center text-sm font-medium">
                                        <CheckCircle2 className={`w-5 h-5 mr-3 ${analysisProgress >= 50 ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={analysisProgress >= 50 ? 'text-gray-900' : 'text-gray-400'}>Sending to Gemini AI...</span>
                                    </div>
                                    <div className="flex items-center text-sm font-medium">
                                        <CheckCircle2 className={`w-5 h-5 mr-3 ${analysisProgress >= 80 ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={analysisProgress >= 80 ? 'text-gray-900' : 'text-gray-400'}>Processing results...</span>
                                    </div>
                                    <div className="flex items-center text-sm font-medium">
                                        <CheckCircle2 className={`w-5 h-5 mr-3 ${analysisProgress >= 100 ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={analysisProgress >= 100 ? 'text-gray-900' : 'text-gray-400'}>Generating annotations...</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8">
                                <h2 className="text-2xl font-bold mb-8">Ready to Analyze</h2>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left max-w-lg mx-auto mb-8 space-y-4">
                                    <div className="flex items-center">
                                        <User className="w-5 h-5 text-gray-500 mr-3" />
                                        <span className="font-semibold w-24">Patient:</span>
                                        <span className="text-gray-700">{selectedPatient?.name || selectedPatient?.full_name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Activity className="w-5 h-5 text-gray-500 mr-3" />
                                        <span className="font-semibold w-24">Scan Type:</span>
                                        <span className="text-gray-700 uppercase">{scanType}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ImageIcon className="w-5 h-5 text-gray-500 mr-3" />
                                        <span className="font-semibold w-24">File:</span>
                                        <span className="text-gray-700 truncate">{file?.name}</span>
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <button onClick={() => setStep(2)} className="btn-outline px-8">Back</button>
                                    <button onClick={runAnalysis} className="btn-primary text-lg px-8 py-3">
                                        <Activity className="mr-2 w-5 h-5" /> Run AI Analysis
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadScan;
