// components/business/dashboard/MonthlyAnalytics.jsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const MonthlyAnalytics = () => {
    const data = [
        { month: 'Jan', bookings: 10, patients: 15 },
        { month: 'Feb', bookings: 12, patients: 10 },
        { month: 'Mar', bookings: 25, patients: 18 },
        { month: 'Apr', bookings: 20, patients: 22 },
        { month: 'May', bookings: 28, patients: 25 },
        { month: 'Jun', bookings: 32, patients: 20 },
        { month: 'Jul', bookings: 30, patients: 18 },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Analytics</h2>
            
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Bookings</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Patients</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="bookings"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="patients"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyAnalytics;