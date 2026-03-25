import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaAngleRight, FaAngleLeft } from 'react-icons/fa';

const SlotPicker = ({ selectedDate, onDateChange, selectedSlot, onSlotChange, availableDays = 14 }) => {
    const dates = useMemo(() => {
        const d = [];
        for (let i = 0; i < availableDays; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const isToday = i === 0;
            d.push({
                full: date.toISOString().split('T')[0],
                day: date.getDate(),
                weekday: isToday ? 'TODAY' : date.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
                month: date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
            });
        }
        return d;
    }, [availableDays]);

    const timeSlots = [
        "07:00 AM - 09:00 AM", "09:00 AM - 11:00 AM",
        "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM",
        "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM"
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    Select Schedule
                </h3>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200"><FaAngleLeft /></button>
                    <button className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200"><FaAngleRight /></button>
                </div>
            </div>

            {/* Date Ribbon */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {dates.map((d, i) => (
                    <button
                        key={i}
                        onClick={() => onDateChange(d.full)}
                        className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${selectedDate === d.full
                                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-lg shadow-blue-900/20'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'
                            }`}
                    >
                        <span className="text-[9px] font-bold mb-1 opacity-80">{d.month}</span>
                        <span className="text-xl font-black">{d.day}</span>
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">{d.weekday}</span>
                    </button>

                ))}
                {/* Custom Date Picker Button */}
                <div className="flex-shrink-0">
                    <label className="w-20 h-24 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 cursor-pointer hover:bg-gray-50 flex-shrink-0">
                        <input
                            type="date"
                            className="hidden"
                            onChange={(e) => onDateChange(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <FaCalendarAlt className="text-xl mb-1" />
                        <span className="text-[10px] font-bold text-center">CHOOSE DATE</span>
                    </label>
                </div>
            </div>

            {/* Slot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {timeSlots.map((slot, i) => (
                    <button
                        key={i}
                        onClick={() => onSlotChange(slot)}
                        className={`p-4 rounded-2xl text-sm font-bold flex items-center justify-between border-2 transition-all ${selectedSlot === slot
                                ? 'bg-blue-50 text-[#1e3a5f] border-blue-200 shadow-sm'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <FaClock className={selectedSlot === slot ? 'text-blue-500' : 'text-gray-300'} />
                            {slot}
                        </div>
                        {selectedSlot === slot && <FaCheckCircle className="text-blue-500" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SlotPicker;
