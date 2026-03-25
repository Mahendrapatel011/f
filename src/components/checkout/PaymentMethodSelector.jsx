import React, { useState } from 'react';
import { FaMobileAlt, FaMoneyBillWave, FaWallet, FaCreditCard, FaCheckSquare, FaSquare } from 'react-icons/fa';

const PaymentMethodSelector = ({
    selectedMethod,
    onSelect,
    walletBalance = 0,
    totalAmount = 0,
    onConfirm,
    loading = false
}) => {
    const isWalletSufficient = walletBalance >= totalAmount;
    const amountRemaining = Math.max(0, totalAmount - walletBalance);
    const [payWithWallet, setPayWithWallet] = useState(true);

    const methods = [
        {
            id: 'online',
            label: 'UPI ID',
            icon: <span className="text-xs font-bold text-gray-400 italic">UPI&gt;</span>,
            description: 'UPI, Card, Netbanking'
        },
        {
            id: 'cod',
            label: 'Pay on Location',
            icon: <span className="text-lg text-gray-600">₹</span>,
            description: 'Pay after sample collect'
        },
        {
            id: 'wallet',
            label: 'Wallet Money',
            icon: <FaWallet className="text-gray-600" />,
            description: `Balance: ₹${walletBalance?.toLocaleString()}`,
            show: walletBalance > 0
        }
    ].filter(m => m.show !== false);

    const renderContent = () => {
        if (!selectedMethod || !methods.find(m => m.id === selectedMethod)) {
            return (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <FaCreditCard className="text-4xl text-gray-300 transform -rotate-12" />
                    </div>
                    <h4 className="text-xl font-bold text-red-500 mb-2 underline decoration-red-200 decoration-4 underline-offset-8">
                        No payment method selected yet.
                    </h4>
                    <p className="text-gray-400 text-sm mt-4">
                        Please choose a payment option to continue.
                    </p>
                </div>
            );
        }

        if (selectedMethod === 'cod') {
            return (
                <div className="w-full flex flex-col h-full">
                    <h4 className="text-lg font-bold text-gray-900 mb-8">Payment Confirmation</h4>
                    <div className="flex-1">
                        <p className="text-gray-400 text-sm leading-relaxed mb-12">
                            You have chosen to <span className="font-bold text-gray-700">pay at the test center</span> on the day of your appointment.
                        </p>
                        <p className="text-gray-900 font-bold mb-8">
                            Do you confirm to proceed with <span className="text-[#1e3a5f]">Pay on Location</span>?
                        </p>
                    </div>
                    <button
                        onClick={() => onConfirm('cod')}
                        disabled={loading}
                        className="w-full py-4 bg-[#1c335a] text-white rounded-xl font-bold hover:bg-[#152943] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Confirm'}
                    </button>
                </div>
            );
        }

        if (selectedMethod === 'wallet') {
            const currentAmountFromWallet = payWithWallet ? Math.min(Number(totalAmount), Number(walletBalance)) : 0;
            const finalRemaining = Math.max(0, Number(totalAmount) - currentAmountFromWallet);
            const needsAdditional = finalRemaining > 0;

            return (
                <div className="w-full flex flex-col h-full">
                    <div className="space-y-6 pt-4">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="text-base font-medium text-gray-800">Total Amount</span>
                            <span className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <span className="text-base font-medium text-gray-800">Wallet Balance</span>
                            <span className="text-xl font-bold text-gray-900">₹{walletBalance.toLocaleString()}</span>
                        </div>

                        <button
                            onClick={() => setPayWithWallet(!payWithWallet)}
                            className="flex items-center gap-3 text-gray-700 font-medium py-2"
                        >
                            {payWithWallet ? (
                                <div className="bg-green-500 text-white rounded p-0.5"><FaCheckSquare /></div>
                            ) : (
                                <FaSquare className="text-gray-200" />
                            )}
                            Pay with Wallet
                        </button>

                        {needsAdditional && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-medium text-gray-800">Amount remaining</span>
                                    <span className="text-xl font-bold text-gray-900">₹{finalRemaining.toLocaleString()}</span>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="font-bold text-gray-900">Select Additional Payment Method</h5>
                                    <p className="text-sm text-gray-500">Pay remaining ₹{finalRemaining.toLocaleString()} using -</p>
                                    <div className="flex items-center gap-3 p-4 border border-blue-50 bg-blue-50/20 rounded-xl">
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 italic">UPI&gt;</span>
                                        <span className="font-bold text-sm text-gray-900">UPI ID</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-6">
                        <button
                            onClick={() => onConfirm(needsAdditional ? 'online' : 'wallet')}
                            disabled={loading || (!payWithWallet && needsAdditional)}
                            className="w-full py-4 bg-[#1c335a] text-white rounded-xl font-bold hover:bg-[#152943] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : needsAdditional ? 'Continue payment' : 'Pay Now'}
                        </button>
                    </div>
                </div>
            );
        }

        if (selectedMethod === 'online') {
            return (
                <div className="w-full flex flex-col h-full">
                    <h4 className="text-lg font-bold text-gray-900 mb-8">Payment Confirmation</h4>
                    <div className="flex-1">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-8">
                            <span className="text-base font-medium text-gray-800">Total Amount</span>
                            <span className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-blue-800 font-medium p-6 bg-blue-50 rounded-2xl border border-blue-100 border-dashed">
                            Secure payment process via Razorpay. Supported: UPI, Cards, Netbanking.
                        </p>
                    </div>
                    <button
                        onClick={() => onConfirm('online')}
                        disabled={loading}
                        className="w-full py-4 bg-[#1c335a] text-white rounded-xl font-bold hover:bg-[#152943] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
            );
        }
    };

    return (
        <div className="flex bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm min-h-[480px] h-auto">
            {/* Sidebar Tabs */}
            <div className="w-80 bg-[#f3f3f3] border-r border-gray-100 flex flex-col shrink-0">
                {methods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={`flex items-center gap-4 p-6 text-left border-b border-gray-200 transition-all ${selectedMethod === method.id
                            ? 'bg-white'
                            : 'hover:bg-gray-100'
                            }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-[#1c335a]' : 'border-gray-400'
                            }`}>
                            {selectedMethod === method.id && <div className="w-2.5 h-2.5 bg-[#1c335a] rounded-full" />}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 flex justify-center">{method.icon}</div>
                            <span className={`font-bold text-sm ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                {method.label}
                            </span>
                        </div>
                    </button>
                ))}
                <div className="flex-1" />
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col p-10 bg-white">
                {renderContent()}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
