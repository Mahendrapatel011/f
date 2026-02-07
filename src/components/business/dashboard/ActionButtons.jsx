// components/business/dashboard/ActionButtons.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileAlt, FaTag, FaLock } from 'react-icons/fa';

const ActionButtons = ({ profileCompletion = 0 }) => {
    const navigate = useNavigate();

    const buttons = [
        {
            id: 1,
            label: 'Upload Test Report',
            icon: <FaUpload />,
            bgColor: 'bg-[#1a237e]',
            hoverColor: 'hover:bg-[#0d1757] cursor-pointer',
            textColor: 'text-white',
            action: () => console.log('Upload Report Clicked'),
            disabled: false
        },
        {
            id: 2,
            label: 'Upload Catalogue',
            icon: <FaFileAlt />,
            bgColor: 'bg-[#f59e0b]',
            hoverColor: 'hover:bg-[#d97706] cursor-pointer',
            textColor: 'text-white',
            action: () => navigate('/business/test-catalogue'),
            disabled: profileCompletion < 75,
            disabledMessage: 'Complete profile (75%+) to unlock'
        },
        {
            id: 3,
            label: 'Offers',
            icon: <FaTag />,
            bgColor: 'bg-gray-100',
            hoverColor: 'hover:bg-gray-200 cursor-pointer',
            textColor: 'text-gray-700',
            action: () => console.log('Offers Clicked'),
            disabled: false
        },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {buttons.map((btn) => (
                <div key={btn.id} className="relative group">
                    <button
                        onClick={btn.disabled ? null : btn.action}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors 
                            ${btn.disabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : `${btn.bgColor} ${btn.hoverColor} ${btn.textColor}`
                            }`}
                    >
                        {btn.disabled ? <FaLock /> : btn.icon}
                        <span>{btn.label}</span>
                    </button>

                    {/* Tooltip for disabled state */}
                    {btn.disabled && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {btn.disabledMessage}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ActionButtons;