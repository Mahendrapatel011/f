// components/business/dashboard/StatsCard.jsx
import React from 'react';
import { FaCalendarAlt, FaFileAlt, FaUser, FaRupeeSign } from 'react-icons/fa';

const StatsCard = ({ title, value, icon, color, onClick }) => {
    const getIcon = () => {
        const iconClass = "text-xl";
        switch (icon) {
            case 'calendar':
                return <FaCalendarAlt className={`${iconClass} text-blue-600`} />;
            case 'document':
                return <FaFileAlt className={`${iconClass} text-yellow-600`} />;
            case 'patient':
                return <FaUser className={`${iconClass} text-orange-500`} />;
            case 'rupee':
                return <FaRupeeSign className={`${iconClass} text-green-600`} />;
            default:
                return null;
        }
    };

    const getBgColor = () => {
        switch (color) {
            case 'blue': return 'bg-blue-100';
            case 'yellow': return 'bg-yellow-100';
            case 'orange': return 'bg-orange-100';
            case 'green': return 'bg-green-100';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200 active:scale-95' : ''}`}
        >
            <div className={`w-10 h-10 ${getBgColor()} rounded-lg flex items-center justify-center flex-shrink-0`}>
                {getIcon()}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default StatsCard;