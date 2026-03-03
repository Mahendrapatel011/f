import React from 'react';
import { HiOutlineLightBulb, HiOutlineCalendar, HiOutlineUserGroup, HiOutlineCurrencyRupee } from 'react-icons/hi';

const OfferStats = ({ stats }) => {
    const statItems = [
        {
            label: 'Active Offers',
            value: stats.active || 0,
            icon: <HiOutlineLightBulb className="text-xl text-green-600" />,
            bgColor: 'bg-green-100'
        },
        {
            label: 'Scheduled',
            value: stats.scheduled || 0,
            icon: <HiOutlineCalendar className="text-xl text-blue-600" />,
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Total Booking',
            value: stats.bookings || 0,
            icon: <HiOutlineUserGroup className="text-xl text-red-600" />,
            bgColor: 'bg-red-100'
        },
        {
            label: 'Total Revenue',
            value: stats.revenue || 0,
            icon: <HiOutlineCurrencyRupee className="text-xl text-yellow-600" />,
            bgColor: 'bg-yellow-100',
            isCurrency: true
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                    <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {item.icon}
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">{item.label}</p>
                        <p className="text-xl font-bold text-gray-800">
                            {item.isCurrency ? `₹${item.value.toLocaleString()}` : item.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OfferStats;
