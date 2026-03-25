// pages/profile/MyAccountPage.jsx
import { useState, useEffect } from 'react';
import { WalletCard, AddMoneyForm, PaymentMethod, TransactionTable } from '../../../components/account';
import SuccessModal from '../../../components/common/SuccessModal';
import walletService from '../../../services/walletService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const MyAccountPage = () => {
    const { user, token } = useAuth();
    const [walletBalance, setWalletBalance] = useState(0);
    const [savedUpiId, setSavedUpiId] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [addedAmount, setAddedAmount] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWalletStats();
    }, []);

    const fetchWalletStats = async () => {
        try {
            setLoading(true);
            const res = await walletService.getStats();
            if (res.success) {
                setWalletBalance(res.balance);
                setTransactions(res.transactions);
            }
        } catch (err) {
            console.error('Error fetching wallet stats:', err);
            toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleAddMoney = async (amount) => {
        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Razorpay SDK failed to load");
                return;
            }

            const res = await walletService.addMoney(amount);

            if (res.success) {
                const options = {
                    key: "rzp_test_SPY2NC2W6Sqvmb",
                    amount: res.razorpayOrder.amount,
                    currency: "INR",
                    name: "Healthorate",
                    description: "Wallet Top-up",
                    order_id: res.razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                amount: amount
                            };

                            const verifyRes = await walletService.verifyAddMoney(verifyData);
                            if (verifyRes.success) {
                                setWalletBalance(verifyRes.balance);
                                setAddedAmount(amount);
                                setShowSuccessModal(true);
                                fetchWalletStats(); // Refresh transactions
                            }
                        } catch (err) {
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.mobile
                    },
                    theme: {
                        color: "#1e3a5f"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            }
        } catch (error) {
            console.error('Add money error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
        }
    };

    const handleSaveUpi = (upiId) => {
        setSavedUpiId(upiId);
        toast.success('UPI ID saved successfully!');
    };

    if (loading && transactions.length === 0) {
        return <div className="text-center py-10 text-gray-500">Loading wallet info...</div>;
    }

    return (
        <div className="space-y-8">
            <p className="text-gray-500 text-sm">
                Manage your wallet balance and transactions
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WalletCard balance={walletBalance} />
                <AddMoneyForm onAddMoney={handleAddMoney} />
            </div>

            <hr className="border-gray-200" />

            <PaymentMethod
                savedUpiId={savedUpiId}
                onSave={handleSaveUpi}
                onDiscard={() => console.log('Discarded')}
            />

            <hr className="border-gray-200" />

            <TransactionTable
                transactions={transactions}
                onShowMore={() => { }}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Money Added Successfully"
                message={`₹${addedAmount.toLocaleString('en-IN')} has been added to your wallet`}
                buttonText="Done"
            />
        </div>
    );
};

export default MyAccountPage;
