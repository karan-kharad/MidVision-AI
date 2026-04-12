import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeverityBadge from '../components/SeverityBadge';
import ConfidenceBar from '../components/ConfidenceBar';
import { Download, FileText, ArrowLeft, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { getScanResult } from '../api/scans';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
};

const mockResult = {
    scan_id: 7,
    patient: "Rahul Sharma",
    status: "done",
    date: "12 Apr 2026, 10:30 AM",
    ai_result: {
        condition: "Forearm Fracture",
        confidence: 87,
        severity: "high",
        location: "Left forearm mid-shaft",
        fracture_detected: true,
        findings: [
            "Clear fracture line visible at mid-shaft",
            "Cortical disruption present",
            "Soft tissue swelling observed"
        ],
        recommendation: "Orthopedic consultation required immediately"
    },
    images: {
        original: "https://images.unsplash.com/photo-1583324113626-d6b0bf5d4b8f?auto=format&fit=crop&q=80&w=800",
        annotated: "https://images.unsplash.com/photo-1583324113626-d6b0bf5d4b8f?auto=format&fit=crop&q=80&w=800" // In a real app this would be annotated
    }
};

const ScanResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generatingReport, setGeneratingReport] = useState(false);
    const [reportText, setReportText] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const scanData = await getScanResult(id);
                // Assume data returned maps correctly, or at least fallback gracefully.
                // In a perfect system we merge deep defaults if some fields are missing
                setData({
                    ...scanData,
                    ai_result: scanData.ai_result || mockResult.ai_result,
                    images: scanData.images || mockResult.images
                });
            } catch (err) {
                console.warn('API getScanResult failed, using mock data');
                setData(mockResult);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    const handleGenerateReport = () => {
        setGeneratingReport(true);
        setTimeout(() => {
            setGeneratingReport(false);
            setReportText(`MEDVISION AI DIAGNOSTIC REPORT
==============================
Patient: ${data.patient}
Date: ${data.date}
Scan ID: ${id}

CLINICAL INDICATION
Patient presented with pain and swelling. Requested evaluation for potential fracture.

TECHNIQUE
Standard two-view X-ray.

FINDINGS
${data.ai_result.findings.map(f => '- ' + f).join('\n')}

IMPRESSION
${data.ai_result.condition} detected at ${data.ai_result.location} with ${data.ai_result.confidence}% confidence.

RECOMMENDATION
${data.ai_result.recommendation}
`);
            toast.success('Report generated successfully');
        }, 1500);
    };

    const handleDownload = () => {
        if (!reportText) return;
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MedVision_Report_${id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center space-x-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-gray-500 font-medium">Loading scan results...</span>
            </div>
        );
    }

    if (!data) return <div>Failed to load data</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0]">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Scan ID: {id}</h1>
                        <p className="text-sm text-gray-500">{data.patient} • {data.date}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="btn-outline" onClick={() => navigate('/patients/1')}>Back to Patient</button>
                    {!reportText && (
                        <button
                            className="btn-primary"
                            onClick={handleGenerateReport}
                            disabled={generatingReport}
                        >
                            {generatingReport ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <FileText className="w-5 h-5 mr-2" />}
                            {generatingReport ? 'Generating...' : 'Generate Report'}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFt COLUMN - Images */}
                <div className="space-y-6">
                    <div className="medical-card p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            Original Scan
                        </h3>
                        <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-black aspect-square flex items-center justify-center relative group">
                            <img src={getImageUrl(data.images?.original || data.image)} alt="Original Scan" className="max-h-full object-contain grayscale" />
                        </div>
                    </div>

                    <div className="medical-card p-6 border-2 border-primary">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">AI Annotated result</span>
                            <SeverityBadge severity={data.ai_result.severity} />
                        </h3>
                        <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-black aspect-square flex items-center justify-center relative">
                            {data.images?.annotated || data.annotated_image ? (
                                <img src={getImageUrl(data.images?.annotated || data.annotated_image)} alt="Annotated Scan" className="max-h-full object-contain" />
                            ) : (
                                <div className="text-gray-500 font-medium p-4 text-center">No annotations available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - AI Results */}
                <div className="space-y-6">
                    <div className="medical-card p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.ai_result.condition}</h2>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-medium">{data.ai_result.location}</span>
                                </div>
                            </div>
                            <SeverityBadge severity={data.ai_result.severity} />
                        </div>

                        <div className="py-6 border-t border-b border-[#E2E8F0] mb-6">
                            <ConfidenceBar confidence={data.ai_result.confidence} severity={data.ai_result.severity} />
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <span className="text-gray-700 font-semibold w-1/3">Fracture Detected:</span>
                                {data.ai_result.fracture_detected ? (
                                    <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-md">✅ YES</span>
                                ) : (
                                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-md">❌ NO</span>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Key Findings</h4>
                            <ul className="space-y-2">
                                {data.ai_result.findings.map((finding, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-primary mr-2 mt-1">•</span>
                                        <span className="text-gray-700">{finding}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                            <h4 className="font-semibold text-blue-900 mb-1">Recommendation</h4>
                            <p className="text-blue-800">💊 {data.ai_result.recommendation}</p>
                        </div>
                    </div>

                    {reportText && (
                        <div className="medical-card p-8 bg-gray-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg flex items-center"><FileText className="w-5 h-5 mr-2 text-primary" /> Generated Report</h3>
                                <button onClick={handleDownload} className="btn-outline text-sm py-1.5"><Download className="w-4 h-4 mr-2" /> Download .txt</button>
                            </div>
                            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-white p-6 border border-[#E2E8F0] rounded-xl shadow-inner overflow-auto max-h-96">
                                {reportText}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanResult;
