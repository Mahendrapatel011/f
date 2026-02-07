// components/account/AddMoneyForm.jsx
import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import AmountButton from '../common/AmountButton';

const AddMoneyForm = ({ onAddMoney, loading = false }) => {
    const [amount, setAmount] = useState('');
    const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);

    const quickAmounts = [1000, 1500, 2000, 5000];

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
            onAddMoney(parseFloat(amount));
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Add Money to Wallet</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Input */}
                <div className="flex gap-3">
                    <Input
                        type="number"
                        name="amount"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={handleInputChange}
                        className="flex-1"
                        min="1"
                    />
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((quickAmount) => (
                        <AmountButton
                            key={quickAmount}
                            amount={quickAmount}
                            isSelected={selectedQuickAmount === quickAmount}
                            onClick={handleQuickAmountClick}
                        />
                    ))}
                </div>

                {/* Add Money Button */}
                <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    disabled={!amount || loading}
                    className="w-full sm:w-auto"
                >
                    {loading ? 'Processing...' : 'Add Money'}
                </Button>
            </form>
        </div>
    );
};

export default AddMoneyForm;