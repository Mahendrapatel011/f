// components/common/DateRangePicker.jsx
import { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const DateRangePicker = ({ 
    startDate, 
    endDate, 
    onDateChange,
    className = '' 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localStartDate, setLocalStartDate] = useState(startDate || '');
    const [localEndDate, setLocalEndDate] = useState(endDate || '');

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '/');
    };

    const handleApply = () => {
        onDateChange({ startDate: localStartDate, endDate: localEndDate });
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg
                    text-sm text-gray-700 hover:border-[#1e3a5f] transition-colors bg-white"
            >
                <FaCalendarAlt className="text-gray-400" />
                <span>
                    {startDate && endDate 
                        ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
                        : 'Select Date Range'
                    }
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)} 
                    />
                    <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-xl 
                        border border-gray-200 z-50 min-w-[280px]">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
                                <input
                                    type="date"
                                    value={localStartDate}
                                    onChange={(e) => setLocalStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                                        focus:outline-none focus:border-[#1e3a5f]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">End Date</label>
                                <input
                                    type="date"
                                    value={localEndDate}
                                    onChange={(e) => setLocalEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                                        focus:outline-none focus:border-[#1e3a5f]"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 
                                        rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="flex-1 px-4 py-2 text-sm text-white bg-[#1e3a5f] 
                                        rounded-lg hover:bg-[#2d4a6f]"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DateRangePicker;