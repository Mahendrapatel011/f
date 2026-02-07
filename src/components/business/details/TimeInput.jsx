// components/business/details/TimeInput.jsx
import React from 'react';
import { FaClock } from 'react-icons/fa';

const TimeInput = ({ value, onChange, disabled = false }) => {
    return (
        <div className="relative">
            <input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            />
        </div>
    );
};

export default TimeInput;