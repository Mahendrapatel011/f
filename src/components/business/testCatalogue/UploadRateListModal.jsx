// components/business/testCatalogue/UploadRateListModal.jsx
import React, { useState, useRef } from 'react';
import { IoCloseOutline, IoCloudUploadOutline, IoDocumentTextOutline } from 'react-icons/io5';

const UploadRateListModal = ({ isOpen, onClose, onUpload }) => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;
        
        setLoading(true);
        try {
            await onUpload(file);
            setFile(null);
            onClose();
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-[#1a237e]">Upload Rate List</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoCloseOutline className="text-2xl text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Upload Area */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                            dragActive 
                                ? 'border-[#1a237e] bg-blue-50' 
                                : 'border-gray-300 hover:border-[#1a237e] hover:bg-gray-50'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleChange}
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                        />
                        
                        {file ? (
                            <div className="flex flex-col items-center">
                                <IoDocumentTextOutline className="text-4xl text-[#1a237e] mb-2" />
                                <p className="font-medium text-gray-800">{file.name}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <IoCloudUploadOutline className="text-4xl text-gray-400 mb-2" />
                                <p className="font-medium text-gray-700">
                                    Drag & drop your file here
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    or click to browse
                                </p>
                                <p className="text-xs text-gray-400 mt-3">
                                    Supported formats: CSV, XLSX, XLS
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Download Template */}
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Need help?{' '}
                        <button className="text-[#1a237e] font-medium hover:underline">
                            Download template
                        </button>
                    </p>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className="w-full py-3 bg-[#1a237e] text-white rounded-lg font-medium hover:bg-[#0d1453] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadRateListModal;