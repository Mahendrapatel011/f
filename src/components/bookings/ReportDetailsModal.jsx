import React, { useState, useEffect } from 'react';
import { IoClose, IoDocumentTextOutline, IoDownloadOutline, IoTimeOutline, IoPersonOutline, IoCalendarOutline } from 'react-icons/io5';
import axios from 'axios';
import Modal from '../common/Modal';

const ReportDetailsModal = ({ isOpen, onClose, orderId }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchReport();
        }
    }, [isOpen, orderId]);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/customer`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.data.success) {
                // Find the report for this specific order
                const foundReport = res.data.data.find(r => r.order === orderId || r.order?._id === orderId);
                setReport(foundReport);
                if (!foundReport) {
                    setError('Report not found for this booking.');
                }
            }
        } catch (err) {
            console.error('Error fetching report:', err);
            setError('Failed to load report details.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="p-1">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <IoDocumentTextOutline className="text-blue-600 w-6 h-6" />
                        Test Report Details
                    </h2>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Fetching your report...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="bg-orange-50 text-orange-600 p-4 rounded-xl inline-block mb-4">
                            {error}
                        </div>
                        <p className="text-sm text-gray-500">Try checking back later or contact the lab.</p>
                    </div>
                ) : report ? (
                    <div className="space-y-6">
                        {/* Patient & Test Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <IoPersonOutline className="text-blue-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Patient Name</p>
                                        <p className="font-bold text-gray-900">{report.patientName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <IoCalendarOutline className="text-purple-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Age / Gender</p>
                                        <p className="font-bold text-gray-900">{report.age} Years / {report.gender}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <IoDocumentTextOutline className="text-green-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Test Type</p>
                                        <p className="font-bold text-gray-900">{report.testType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <IoTimeOutline className="text-amber-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Report Date</p>
                                        <p className="font-bold text-gray-900">{new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Files Section */}
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Attached Report Files</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {report.files?.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white hover:border-blue-200 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                <IoDocumentTextOutline className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • {file.fileType?.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <a 
                                            href={`http://localhost:5000${file.url.startsWith('/') ? '' : '/'}${file.url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <IoDownloadOutline className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        {report.notes && (
                            <div className="mt-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <h3 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wider underline">Lab Notes</h3>
                                <p className="text-sm text-gray-700 italic">"{report.notes}"</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </Modal>
    );
};

export default ReportDetailsModal;
