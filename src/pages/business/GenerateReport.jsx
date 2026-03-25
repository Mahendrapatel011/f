import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBack, IoClose, IoCloudUploadOutline, IoDocumentTextOutline, IoTrashOutline } from 'react-icons/io5';
import BusinessNavbar from '../../components/business/BusinessNavbar';
import reportService from '../../services/reportService';
import toast from 'react-hot-toast';

const GenerateReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking } = location.state || {};

    const [formData, setFormData] = useState({
        patientName: booking?.customer?.name || '',
        age: '',
        gender: 'Male',
        patientId: booking?._id?.slice(-8).toUpperCase() || '',
        contactNumber: booking?.customer?.mobile || '',
        testDate: booking?.scheduledDate ? new Date(booking.scheduledDate).toISOString().split('T')[0] : '',
        testType: booking?.items?.[0]?.name || '', // Default to first test
        notes: ''
    });

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!booking) {
            navigate('/business/bookings');
            return;
        }

        if (booking.orderStatus === 'confirmed') {
            toast.error('Please verify OTP before generating report');
            navigate('/business/bookings');
        }
    }, [booking, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!booking?._id) {
            toast.error('Invalid booking context');
            return;
        }

        if (files.length === 0) {
            toast.error('Please upload at least one report file');
            return;
        }

        const data = new FormData();
        data.append('orderId', booking._id);
        data.append('patientName', formData.patientName);
        data.append('patientId', formData.patientId);
        data.append('contactNumber', formData.contactNumber);
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('testDate', formData.testDate);
        data.append('testType', formData.testType);
        data.append('notes', formData.notes);

        files.forEach(file => {
            data.append('files', file);
        });

        try {
            setLoading(true);
            const res = await reportService.uploadReport(data);
            if (res.success) {
                toast.success('Report generated and sent to patient!');
                navigate('/business/bookings');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <BusinessNavbar />

            <div className="max-w-[1000px] mx-auto px-4 py-8">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium"
                >
                    <IoArrowBack className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">Generate Report</h1>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Patient Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Age <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Patient ID */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient ID <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50"
                                required
                                readOnly
                            />
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        {/* Test Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Test Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="testDate"
                                value={formData.testDate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        {/* Test Type Select */}
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Test Type <span className="text-red-500">*</span></label>
                        <select
                            name="testType"
                            value={formData.testType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                            required
                        >
                            {booking?.items?.map((item, idx) => (
                                <option key={idx} value={item.name}>{item.name}</option>
                            ))}
                            <option value="General Report">General Report</option>
                        </select>
                    </div>

                    {/* File Upload Area */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">File Upload <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-400 mb-3">Only PDF, DOCX, JPG, PNG</p>

                        {/* Uploaded Files List */}
                        <div className="space-y-3 mb-4">
                            {files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <IoDocumentTextOutline className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)}MB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <IoTrashOutline className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div
                            className="border-2 border-dashed border-blue-100 rounded-xl p-8 text-center bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer relative"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const droppedFiles = Array.from(e.dataTransfer.files);
                                setFiles(prev => [...prev, ...droppedFiles]);
                            }}
                        >
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".pdf,.docx,.jpg,.jpeg,.png"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <IoCloudUploadOutline className="w-8 h-8 text-[#1c335a]" />
                                <p className="text-gray-600">
                                    Drop your file here or <span className="text-blue-600 underline">choose file</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Notes/Comments</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Patient's report details..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#1c335a] text-white rounded-xl font-bold text-lg hover:bg-[#152a4a] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GenerateReport;
