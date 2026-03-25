import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaChevronRight, FaInfoCircle, FaShieldAlt, FaCreditCard, FaMoneyBillWave, FaWallet, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import walletService from '../../services/walletService';
import SlotPicker from '../../components/checkout/SlotPicker';
import PaymentMethodSelector from '../../components/checkout/PaymentMethodSelector';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const { fetchCart } = useCart();

    const checkoutData = location.state || {};
    const { items = [], collectionType, address, summary } = checkoutData;

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [loading, setLoading] = useState(false);
    const [isPrecautionModalOpen, setIsPrecautionModalOpen] = useState(false);
    const [selectedTestInstructions, setSelectedTestInstructions] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await walletService.getStats();
                if (res.success) {
                    setWalletBalance(res.balance);
                }
            } catch (err) {
                console.error('Error fetching wallet:', err);
            }
        };
        if (token) fetchWallet();
    }, [token]);

    // Redirect if no data
    useEffect(() => {
        if (!items || items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    // Generate next 7 days for selection
    const availableDates = useMemo(() => {
        const dates = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push({
                full: date.toISOString().split('T')[0],
                display: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
                day: date.getDate(),
                weekday: date.toLocaleDateString('en-IN', { weekday: 'short' })
            });
        }
        return dates;
    }, []);

    const timeSlots = [
        "07:00 AM - 09:00 AM",
        "09:00 AM - 11:00 AM",
        "11:00 AM - 01:00 PM",
        "01:00 PM - 03:00 PM",
        "03:00 PM - 05:00 PM",
        "05:00 PM - 07:00 PM"
    ];

    const handleOpenPrecautions = (item) => {
        setSelectedTestInstructions(item);
        setIsPrecautionModalOpen(true);
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async (methodOverride) => {
        if (!selectedDate || !selectedSlot) {
            toast.error('Please select date and time slot');
            return;
        }

        const finalMethod = methodOverride && typeof methodOverride === 'string' ? methodOverride : paymentMethod;
        const walletAmountUsed = (finalMethod === 'online' && paymentMethod === 'wallet' && walletBalance > 0)
            ? Math.min(summary.totalAmount, walletBalance)
            : 0;

        setLoading(true);
        try {
            const orderPayload = {
                businessId: items[0].businessId,
                items: items.map(i => ({
                    test: i.id,
                    name: i.testName,
                    price: i.price,
                    discountedPrice: i.offer ? Math.max(0, i.price - (i.offer.discountType === 'percentage' ? (i.price * i.offer.discountValue / 100) : i.offer.discountValue)) : i.price,
                    offerUsed: i.offer ? {
                        title: i.offer.title,
                        code: i.offer.offerCode,
                        discountValue: i.offer.discountValue,
                        discountType: i.offer.discountType
                    } : null
                })),
                collectionType,
                scheduledDate: selectedDate,
                timeSlot: selectedSlot,
                deliveryAddress: collectionType === 'home_collection' ? {
                    name: address.name,
                    addressLine: address.address,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    mobile: user.mobile
                } : null,
                paymentMethod: finalMethod,
                totalAmount: summary.totalAmount,
                walletAmountUsed
            };

            const res = await axios.post('http://localhost:5000/api/orders', orderPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                if (finalMethod === 'online') {
                    const isLoaded = await loadRazorpay();
                    if (!isLoaded) {
                        toast.error("Razorpay SDK failed to load. Are you online?");
                        setLoading(false);
                        return;
                    }

                    const options = {
                        key: "rzp_test_SPY2NC2W6Sqvmb", // Updated with user key
                        amount: res.data.razorpayOrder.amount,
                        currency: "INR",
                        name: "Healthorate",
                        description: "Diagnostic Test Payment",
                        order_id: res.data.razorpayOrder.id,
                        handler: async function (response) {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: res.data.data._id
                            };

                            try {
                                const verifyRes = await axios.post('http://localhost:5000/api/orders/verify', verifyData, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                if (verifyRes.data.success) {
                                    toast.success('Payment successful! Order confirmed.');
                                    fetchCart();
                                    navigate('/profile', { state: { activeTab: 'report' } });
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
                } else if (finalMethod === 'wallet') {
                    toast.success('Order placed successfully using Wallet!');
                    fetchCart();
                    navigate('/profile', { state: { activeTab: 'report' } });
                } else {
                    toast.success('Order placed successfully (COD)');
                    fetchCart();
                    navigate('/profile', { state: { activeTab: 'report' } });
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => navigate(-1);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaArrowLeft className="text-[#1e3a5f] text-xl" />
                </button>
                <h1 className="text-xl font-bold text-[#1e3a5f]">Secure Payment</h1>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Schedule & Payment */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* 1. Schedule Selection */}
                        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <SlotPicker
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                                selectedSlot={selectedSlot}
                                onSlotChange={setSelectedSlot}
                                availableDays={15}
                            />
                        </section>

                        {/* 2. Payment Method */}
                        <section>
                            <h3 className="text-lg font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                                Payment Method
                            </h3>
                            <PaymentMethodSelector
                                selectedMethod={paymentMethod}
                                onSelect={setPaymentMethod}
                                walletBalance={walletBalance}
                                totalAmount={summary.totalAmount}
                                onConfirm={handlePlaceOrder}
                                loading={loading}
                            />
                        </section>

                        {/* 3. Review Tests (Optional but good) */}
                        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
                                <FaShieldAlt className="text-green-500" />
                                Review Tests
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border border-gray-100 p-1 flex-shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{item.testName}</p>
                                            <button
                                                onClick={() => handleOpenPrecautions(item)}
                                                className="text-[10px] text-blue-600 font-bold hover:underline"
                                            >
                                                VIEW PRECAUTIONS
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <CheckoutSummary
                            summary={summary}
                            onProceed={handlePlaceOrder}
                            loading={loading}
                            buttonText="Proceed to Checkout"
                        />

                        <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 border-dashed">
                            <div className="flex items-start gap-3">
                                <FaInfoCircle className="text-blue-500 mt-1" />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    By placing the order, you agree to Healthorate's Terms of Service and Privacy Policy. All samples are collected by certified professionals.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Precaution Modal remains same logic */}
            {isPrecautionModalOpen && selectedTestInstructions && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPrecautionModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <FaInfoCircle className="text-3xl text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1e3a5f] text-center mb-2">Pre-test Instructions</h3>
                            <p className="text-gray-400 text-center text-sm mb-8">{selectedTestInstructions.testName}</p>

                            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-8">
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                        Minimum 10-12 hours fasting is required.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                        Avoid alcohol 24 hours before the test.
                                    </li>
                                </ul>
                            </div>
                            <button onClick={() => setIsPrecautionModalOpen(false)} className="w-full py-4 bg-[#1e3a5f] text-white rounded-2xl font-bold">
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
