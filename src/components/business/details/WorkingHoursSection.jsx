// components/business/details/WorkingHoursSection.jsx
import React from 'react';
import { HiOutlineClock } from 'react-icons/hi2';
import SectionCard from './SectionCard';
import TimeInput from './TimeInput';

const WorkingHoursSection = ({ formData, onChange, onWorkingHoursChange }) => {
    const handleToggle24x7 = () => {
        onChange('is24x7', !formData.is24x7);
    };

    return (
        <SectionCard
            icon={<HiOutlineClock className="w-5 h-5" />}
            title="Working Hours"
        >
            {/* 24x7 Toggle */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <input
                    type="checkbox"
                    id="is24x7"
                    checked={formData.is24x7}
                    onChange={handleToggle24x7}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label
                    htmlFor="is24x7"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                    24×7 Available
                </label>
            </div>

            {/* Working Hours Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left text-sm font-semibold text-gray-700 pb-3 w-[120px]">Day</th>
                            <th className="text-center text-sm font-semibold text-gray-700 pb-3 w-[70px]">Open</th>
                            <th className="text-center text-sm font-semibold text-gray-700 pb-3">Opening Time</th>
                            <th className="text-center text-sm font-semibold text-gray-700 pb-3">Closing Time</th>
                            <th className="text-center text-sm font-semibold text-gray-700 pb-3 w-[70px]">Closed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.workingHours.map((item, index) => (
                            <WorkingHoursRow
                                key={item.day}
                                index={index}
                                data={item}
                                disabled={formData.is24x7}
                                onChange={onWorkingHoursChange}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
};

const WorkingHoursRow = ({ index, data, disabled, onChange }) => {
    const getDayColor = (day) => {
        const colors = {
            'Monday': 'bg-blue-600',
            'Tuesday': 'bg-purple-600',
            'Wednesday': 'bg-green-600',
            'Thursday': 'bg-orange-600',
            'Friday': 'bg-pink-600',
            'Saturday': 'bg-teal-600',
            'Sunday': 'bg-red-600',
        };
        return colors[day] || 'bg-gray-600';
    };

    return (
        <tr className="border-b border-gray-100 last:border-b-0">
            {/* Day */}
            <td className="py-3">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getDayColor(data.day)}`}></span>
                    <span className="text-sm font-medium text-gray-800">{data.day}</span>
                </div>
            </td>

            {/* Open Checkbox */}
            <td className="py-3 text-center">
                <input
                    type="checkbox"
                    checked={data.isOpen}
                    onChange={(e) => onChange(index, 'isOpen', e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </td>

            {/* Opening Time */}
            <td className="py-3 px-2">
                <TimeInput
                    value={data.openingTime}
                    onChange={(val) => onChange(index, 'openingTime', val)}
                    disabled={disabled || data.isClosed || !data.isOpen}
                />
            </td>

            {/* Closing Time */}
            <td className="py-3 px-2">
                <TimeInput
                    value={data.closingTime}
                    onChange={(val) => onChange(index, 'closingTime', val)}
                    disabled={disabled || data.isClosed || !data.isOpen}
                />
            </td>

            {/* Closed Checkbox */}
            <td className="py-3 text-center">
                <input
                    type="checkbox"
                    checked={data.isClosed}
                    onChange={(e) => onChange(index, 'isClosed', e.target.checked)}
                    disabled={disabled}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </td>
        </tr>
    );
};

export default WorkingHoursSection;