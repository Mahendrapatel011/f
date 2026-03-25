// components/business/testCatalogue/PrescriptionEditorModal.jsx
import React, { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const PrescriptionEditorModal = ({ isOpen, onClose, onSave, initialText = "" }) => {
    const [text, setText] = useState(initialText);

    useEffect(() => {
        setText(initialText);
    }, [initialText, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#f8f9fe]">
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-[#1a237e]">Write Prescription / Important Notes</h3>
                        <p className="text-xs text-gray-400 mt-1">Add detailed instructions for the user.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800 shadow-sm bg-white"
                    >
                        <IoCloseOutline size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type test instructions here (e.g., Fasting required, 1-hour prior to test...)"
                        className="w-full h-[400px] p-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a237e] focus:outline-none text-lg leading-relaxed placeholder:text-gray-300 font-outfit resize-none transition-all"
                    />
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-50 flex justify-end gap-3 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSave(text);
                            onClose();
                        }}
                        className="px-10 py-3 bg-[#1a237e] text-white rounded-xl font-bold hover:bg-[#0d1453] transition-all shadow-lg active:scale-95"
                    >
                        Save Prescription
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionEditorModal;
