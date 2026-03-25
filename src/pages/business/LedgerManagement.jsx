import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import LedgerTable from '../../components/ledger/LedgerTable';
import LedgerSummaryCard from '../../components/ledger/LedgerSummaryCard';
import LedgerActionForm from '../../components/ledger/LedgerActionForm';
import BusinessNavbar from '../../components/business/BusinessNavbar';
import ledgerService from '../../services/ledgerService';
import toast from 'react-hot-toast';

const LedgerManagement = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        fetchLedger();
    }, []);

    const fetchLedger = async () => {
        try {
            setLoading(true);
            const res = await ledgerService.getMyLedger();
            if (res.success) {
                setBalance(res.data.balance);
                setTransactions(res.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching ledger:', error);
            toast.error('Failed to load ledger details');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (amount, type) => {
        if (type === 'pay_dues') {
            await handlePayDues(amount);
        } else {
            await handleWithdrawal(amount);
        }
    };

    const handlePayDues = async (amount) => {
        setActionLoading(true);
        try {
            const res = await ledgerService.initPayDues(amount);
            if (res.success) {
                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    toast.error("Razorpay SDK failed to load");
                    return;
                }

                const options = {
                    key: "rzp_test_SPY2NC2W6Sqvmb",
                    amount: res.razorpayOrder.amount,
                    currency: "INR",
                    name: "Healthorate Business",
                    description: "Outstanding Dues Settlement",
                    order_id: res.razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            const verifyRes = await ledgerService.verifyPayDues({
                                ...response,
                                amount
                            });
                            if (verifyRes.success) {
                                toast.success('Dues paid successfully!');
                                fetchLedger();
                            }
                        } catch (err) {
                            toast.error('Payment verification failed');
                        }
                    },
                    theme: { color: "#1e3a5f" }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            }
        } catch (error) {
            toast.error('Payment initiation failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleWithdrawal = async (amount) => {
        setActionLoading(true);
        try {
            const res = await ledgerService.requestWithdrawal({
                amount,
                bankDetails: {
                    accountNumber: 'DEFAULT_LINKED',
                    ifscCode: 'NA',
                    accountHolderName: 'Business Owner'
                }
            });
            if (res.success) {
                toast.success('Withdrawal request submitted!');
                fetchLedger();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Withdrawal failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading your ledger...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <BusinessNavbar />

            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 md:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-2"
                    >
                        <IoArrowBack className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h1 className="text-xl md:text-3xl font-black text-[#1e3a5f] uppercase tracking-wider mb-2">My Ledger</h1>
                    <p className="text-gray-500 font-medium text-sm">Keep track of your dues, earnings, and settlements.</p>
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 min-h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <LedgerSummaryCard balance={balance} isAdminMode={false} />
                    <LedgerActionForm
                        balance={balance}
                        loading={actionLoading}
                        onAction={handleAction}
                    />
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 px-2">Transactions History</h3>
                    <LedgerTable transactions={transactions} />
                </div>
            </div>
        </div>
    );
};

export default LedgerManagement;
