// components/business/details/SectionCard.jsx
import React from 'react';

const SectionCard = ({ icon, title, children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
            {/* Section Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="text-[#1a237e]">
                    {icon}
                </div>
                <h2 className="text-base font-semibold text-[#1a237e]">{title}</h2>
            </div>

            {/* Section Content */}
            <div className="p-5">
                {children}
            </div>
        </div>
    );
};

export default SectionCard;