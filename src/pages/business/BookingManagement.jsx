import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoDownloadOutline, IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import BusinessNavbar from '../../components/business/BusinessNavbar';
import NewBookingsModal from '../../components/business/dashboard/NewBookingsModal';
import bookingService from '../../services/bookingService';
import toast from 'react-hot-toast';

const BookingManagement = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // OTP Modal State
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [searchQuery]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingService.getBusinessBookings(searchQuery);
            if (res.success) {
                setBookings(res.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (booking) => {
        try {
            const res = await bookingService.sendVerificationOtp(booking._id);
            if (res.success) {
                setSelectedBooking(booking);
                setIsOtpModalOpen(true);
                setOtp('');
                toast.success('Verification OTP sent to patient');
            }
        } catch (error) {
            toast.error('Failed to send OTP');
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setIsVerifying(true);
            const res = await bookingService.verifyOrderOtp(selectedBooking._id, otp);
            if (res.success) {
                toast.success('Patient verified successfully!');
                setIsOtpModalOpen(false);
                fetchBookings();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await bookingService.updateBookingStatus(id, status);
            if (res.success) {
                toast.success(`Booking marked as ${status}`);
                fetchBookings();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const pendingBookings = bookings.filter(b => b.orderStatus === 'pending');
    const currentBookings = bookings.filter(b => b.orderStatus === 'confirmed' || b.orderStatus === 'collected');
    const bookingHistory = bookings.filter(b => b.orderStatus === 'completed' || b.orderStatus === 'cancelled');

    return (
        <div className="min-h-screen bg-white">
            <BusinessNavbar />

            <div className="max-w-[1150px] mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            <IoArrowBack className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        {/* Search Bar */}
                        <div className="relative group min-w-[300px]">
                            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1c335a] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by mobile, email or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1c335a]/20 focus:border-[#1c335a] transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-white border border-[#1c335a] text-[#1c335a] rounded-full font-bold hover:bg-gray-50 transition-all relative"
                    >
                        Pending Requests
                        {pendingBookings.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-bounce shadow-md">
                                {pendingBookings.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Current Bookings */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Bookings</h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#e0f2f1] text-[#2e3a4e]">
                                    <th className="px-6 py-4 font-bold rounded-tl-xl text-sm">Booking ID</th>
                                    <th className="px-6 py-4 font-bold text-sm">Patient Name</th>
                                    <th className="px-6 py-4 font-bold text-sm">Test Type</th>
                                    <th className="px-6 py-4 font-bold text-sm">Date</th>
                                    <th className="px-6 py-4 font-bold text-sm">Time</th>
                                    <th className="px-6 py-4 font-bold rounded-tr-xl text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentBookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 font-medium text-gray-500 text-sm">#{b._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900">{b.customer?.name}</div>
                                            <div className="text-xs text-gray-500">{b.customer?.mobile}</div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-600 text-sm">
                                            {b.items?.map(i => i.name).join(', ')}
                                            {b.collectionType === 'home_collection' && (
                                                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded uppercase font-bold">Home</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-gray-600 text-sm">{new Date(b.scheduledDate).toLocaleDateString('en-GB')}</td>
                                        <td className="px-6 py-5 text-gray-600 text-sm uppercase">{b.timeSlot}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex gap-2">
                                                {b.orderStatus === 'confirmed' ? (
                                                    <button
                                                        onClick={() => handleSendOTP(b)}
                                                        className="px-6 py-2 bg-[#1c335a] text-white rounded-full text-xs font-bold hover:bg-[#152a4a] transition-all whitespace-nowrap shadow-sm"
                                                    >
                                                        Verify OTP
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (b.reportStatus !== 'uploaded') {
                                                                toast.error('Please generate report before marking as completed');
                                                                return;
                                                            }
                                                            handleUpdateStatus(b._id, 'completed');
                                                        }}
                                                        className={`px-6 py-2 bg-green-600 text-white rounded-full text-xs font-bold hover:bg-green-700 transition-all whitespace-nowrap shadow-sm ${b.reportStatus !== 'uploaded' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        Mark Completed
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (b.orderStatus === 'confirmed') {
                                                            toast.error('Please verify OTP first');
                                                            return;
                                                        }
                                                        navigate('/business/generate-report', { state: { booking: b } });
                                                    }}
                                                    className={`px-6 py-2 border border-[#1c335a] text-[#1c335a] rounded-full text-xs font-bold hover:bg-gray-50 transition-all whitespace-nowrap ${b.orderStatus === 'confirmed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Generate Report
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {currentBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="text-gray-400 font-medium">No active bookings found.</div>
                                                {searchQuery && <div className="text-xs text-gray-500">Try searching for something else</div>}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Booking History */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking History</h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-[#e0f2f1] text-[#2e3a4e]">
                                    <th className="px-6 py-4 font-bold rounded-tl-xl text-sm">Booking ID</th>
                                    <th className="px-6 py-4 font-bold text-sm">Patient Name</th>
                                    <th className="px-6 py-4 font-bold text-sm">Test Type</th>
                                    <th className="px-6 py-4 font-bold text-sm">Date</th>
                                    <th className="px-6 py-4 font-bold text-sm">Time</th>
                                    <th className="px-6 py-4 font-bold text-sm">Status</th>
                                    <th className="px-6 py-4 font-bold rounded-tr-xl text-center text-sm">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookingHistory.map((b) => (
                                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 font-medium text-gray-500 text-sm">#{b._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-5 font-bold text-gray-900 text-sm">{b.customer?.name}</td>
                                        <td className="px-6 py-5 text-gray-600 text-sm">{b.items?.map(i => i.name).join(', ')}</td>
                                        <td className="px-6 py-5 text-gray-600 text-sm">{new Date(b.scheduledDate).toLocaleDateString('en-GB')}</td>
                                        <td className="px-6 py-5 text-gray-600 text-sm uppercase">{b.timeSlot}</td>
                                        <td className="px-6 py-5">
                                            <div className={`px-4 py-1 rounded-full text-center text-xs font-bold inline-block min-w-[90px]
                                                ${b.orderStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                                    b.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                                {b.orderStatus.charAt(0).toUpperCase() + b.orderStatus.slice(1)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="text-gray-400 hover:text-[#1c335a] transition-colors">
                                                <IoDownloadOutline className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {bookingHistory.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400">No history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* OTP Verification Modal */}
            {isOtpModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 bg-[#1c335a] text-white flex justify-between items-center">
                            <h3 className="font-bold text-lg">Verify Patient Booking</h3>
                            <button onClick={() => setIsOtpModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <IoCloseOutline className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <div className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Verification Code Sent To</div>
                                <div className="text-[#1c335a] font-bold text-lg">{selectedBooking?.customer?.mobile || selectedBooking?.customer?.email}</div>
                                <p className="text-gray-400 text-xs mt-2">Enter the 6-digit OTP provided by the patient to collect samples and proceed with the test.</p>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="w-full text-center text-3xl tracking-[1em] font-bold py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#1c335a] focus:bg-white focus:outline-none transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
                                />
                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={isVerifying}
                                    className={`w-full py-4 rounded-xl text-white font-bold transition-all shadow-lg
                                        ${isVerifying ? 'bg-gray-400' : 'bg-[#1c335a] hover:bg-[#152a4a] active:scale-[0.98]'}`}
                                >
                                    {isVerifying ? 'Verifying...' : 'Complete Verification'}
                                </button>
                                <button
                                    onClick={() => handleSendOTP(selectedBooking)}
                                    className="w-full text-sm text-[#1c335a] font-bold hover:underline"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <NewBookingsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                bookings={pendingBookings}
                onRefresh={fetchBookings}
            />
        </div>
    );
};

export default BookingManagement;
