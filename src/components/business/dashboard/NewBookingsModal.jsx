import React, { useState } from 'react';
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5';
import bookingService from '../../../services/bookingService';
import toast from 'react-hot-toast';

const NewBookingsModal = ({ isOpen, onClose, bookings, onRefresh }) => {
    const [confirmingId, setConfirmingId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen) return null;

    const handleAccept = async (id) => {
        try {
            const res = await bookingService.updateBookingStatus(id, 'confirmed');
            if (res.success) {
                setConfirmingId(id);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onRefresh();
                    if (bookings.length === 1) onClose();
                }, 2000);
            }
        } catch (error) {
            toast.error('Failed to accept booking');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">New Bookings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <IoClose className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mx-6 mt-4 p-4 bg-[#2e7d32] text-white rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-white/20 p-2 rounded-full">
                            <IoCheckmarkCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold">Booking is Confirmed!</p>
                            <p className="text-sm opacity-90">Aman Singh's appointment has been added to your schedule.</p>
                        </div>
                    </div>
                )}

                {/* Bookings List */}
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all
                                ${confirmingId === booking._id ? 'bg-[#e0f2f1] border-teal-100' : 'bg-[#e0f7f9] border-[#b2ebf2]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-gray-200">
                                    <img
                                        src={booking.customer?.profileImage || `https://ui-avatars.com/api/?name=${booking.customer?.name}&background=random`}
                                        alt={booking.customer?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{booking.customer?.name}</p>
                                    <p className="text-[10px] text-gray-600 font-medium">
                                        {booking.items?.map(i => i.name).join(', ')}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                        {new Date(booking.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {booking.timeSlot}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAccept(booking._id)}
                                className="px-6 py-2 bg-[#1c335a] text-white rounded-full text-xs font-bold hover:bg-[#152a4a] transition-all shadow-sm active:scale-95"
                            >
                                Accept
                            </button>
                        </div>
                    ))}
                    {bookings.length === 0 && !showSuccess && (
                        <div className="text-center py-8 text-gray-400">
                            No new booking requests.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewBookingsModal;
