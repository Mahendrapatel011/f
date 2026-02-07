// components/business/details/FormInput.jsx
import React from 'react';

const FormInput = ({ 
    label, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    required = false,
    disabled = false,
    className = ''
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            />
        </div>
    );
};

export default FormInput;