import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import AmountButton from '../common/AmountButton';

const LedgerActionForm = ({ balance, onAction, loading = false }) => {
    const [amount, setAmount] = useState('');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);

    // If balance < 0, Lab owes Platform -> Pay Dues Action
    // If balance > 0, Platform owes Lab -> Withdraw Action
    const isLabOwesPlatform = balance < 0;
    const isPlatformOwesLab = balance > 0;
    const absBalance = Math.abs(balance || 0);

    const quickAmounts = isLabOwesPlatform
        ? [500, 1000, 2000, absBalance > 0 ? absBalance : 5000].filter((v, i, a) => a.indexOf(v) === i && v > 0)
        : [1000, 2000, 5000, absBalance > 0 ? absBalance : 10000].filter((v, i, a) => a.indexOf(v) === i && v > 0);

    const handleQuickAmountClick = (quickAmount) => {
        setAmount(quickAmount.toString());
        setSelectedQuickAmount(quickAmount);
    };

    const handleInputChange = (e) => {
        setAmount(e.target.value);
        setSelectedQuickAmount(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (amount && parseFloat(amount) > 0) {
            onAction(parseFloat(amount), isLabOwesPlatform ? 'pay_dues' : 'withdraw');
        }
    };

    if (balance === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-3xl h-full shadow-sm text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">All Settled Up!</h3>
                <p className="text-sm text-gray-500 max-w-xs">You have no outstanding dues to pay and no pending payouts to withdraw.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 pb-8">
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                {isLabOwesPlatform ? 'Pay Outstanding Dues' : 'Withdraw Earnings'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                {isLabOwesPlatform
                    ? 'Clear your ledger dues directly here. This avoids service interruptions.'
                    : 'Withdraw your accumulated earnings from your ledger directly to your bank account.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter Amount</label>
                    <Input
                        type="number"
                        name="amount"
                        placeholder="₹ 0.00"
                        value={amount}
                        onChange={handleInputChange}
                        className="w-full text-lg"
                        min="1"
                        max={isPlatformOwesLab ? absBalance : undefined}
                    />
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2">
                    {quickAmounts.slice(0, 4).map((quickAmount) => (
                        <AmountButton
                            key={quickAmount}
                            amount={quickAmount}
                            isSelected={selectedQuickAmount === quickAmount}
                            onClick={handleQuickAmountClick}
                        />
                    ))}
                </div>

                {/* Action Button */}
                <Button
                    type="submit"
                    variant={isLabOwesPlatform ? "primary" : "secondary"}
                    size="lg"
                    disabled={!amount || loading || parseFloat(amount) <= 0 || (isPlatformOwesLab && parseFloat(amount) > absBalance)}
                    className={`w-full font-bold ${isLabOwesPlatform ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {loading ? 'Processing...' : (isLabOwesPlatform ? 'Pay Dues Now' : 'Withdraw Funds')}
                </Button>
            </form>
        </div>
    );
};

export default LedgerActionForm;
