// components/business/testCatalogue/ViewPrescriptionModal.jsx
import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const ViewPrescriptionModal = ({ isOpen, onClose, text, title = "Full Prescription" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-fadeIn overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#f8f9fe]">
                    <h3 className="text-xl font-bold text-[#1a237e]">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800 shadow-sm bg-white"
                    >
                        <IoCloseOutline size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 max-h-[70vh] overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed text-lg font-outfit">
                    {text || "No prescription details added."}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-50 flex justify-end bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-[#1a237e] text-white rounded-xl font-bold hover:bg-[#0d1453] transition-all shadow-lg active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewPrescriptionModal;
