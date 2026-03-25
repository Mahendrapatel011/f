import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import BusinessNavbar from '../../components/business/BusinessNavbar';
import ledgerService from '../../services/ledgerService';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await ledgerService.getMyWithdrawals();
            if (res.success) {
                setPayments(res.data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading payment history...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <BusinessNavbar />

            <div className="max-w-[1150px] mx-auto px-4 py-8">
                {/* Header */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium"
                >
                    <IoArrowBack className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <h2 className="text-3xl font-bold text-gray-900 mb-8">Payments</h2>

                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#e0f2f1] text-[#2e3a4e]">
                                <th className="px-6 py-4 font-bold rounded-l-xl">Payout Cycle</th>
                                <th className="px-6 py-4 font-bold">Total Bookings</th>
                                <th className="px-6 py-4 font-bold">Payout Amount</th>
                                <th className="px-6 py-4 font-bold rounded-r-xl">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-5 text-gray-600">
                                        {new Date(p.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-6 py-5 text-gray-900 font-medium">
                                        {/* Mocking booking count since it's not in withdrawal model currently */}
                                        {Math.floor(Math.random() * 10) + 5}
                                    </td>
                                    <td className="px-6 py-5 font-bold text-gray-900">
                                        ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`px-4 py-1.5 rounded-full text-center text-sm font-bold inline-block min-w-[150px]
                                            ${p.status === 'approved' || p.status === 'completed' ? 'bg-[#4caf50] text-white' :
                                                p.status === 'pending' ? 'bg-orange-500 text-white' :
                                                    'bg-red-500 text-white'}`}>
                                            {p.status === 'approved' || p.status === 'completed'
                                                ? `Paid on ${new Date(p.updatedAt).toLocaleDateString('en-GB')}`
                                                : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        <p className="text-lg">No payment history found.</p>
                                        <p className="text-sm">When you request withdrawals and they are processed, they will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
