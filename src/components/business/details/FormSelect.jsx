// components/business/details/FormSelect.jsx
import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FormSelect = ({ 
    label, 
    options = [], 
    value, 
    onChange, 
    required = false,
    placeholder = 'Select option',
    className = ''
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-colors"
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
};

export default FormSelect;