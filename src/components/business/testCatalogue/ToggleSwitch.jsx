// components/business/testCatalogue/ToggleSwitch.jsx
import React from 'react';

const ToggleSwitch = ({ isActive, onToggle, disabled = false }) => {
    return (
        <button
            onClick={onToggle}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a237e] focus:ring-offset-2 ${
                isActive ? 'bg-[#1a237e]' : 'bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

export default ToggleSwitch;