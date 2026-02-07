// pages/profile/MyAccountPage.jsx
import { useState } from 'react';
import { WalletCard, AddMoneyForm, PaymentMethod, TransactionTable } from '../../../components/account';
import SuccessModal from '../../../components/common/SuccessModal';

const MyAccountPage = () => {
    const [walletBalance, setWalletBalance] = useState(2450.00);
    const [savedUpiId, setSavedUpiId] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [addedAmount, setAddedAmount] = useState(0);
    const [transactions, setTransactions] = useState([
        {
            id: 'TXN1234567890',
            type: 'Sent',
            amount: 1250.00,
            date: '2025-05-19'
        },
        {
            id: 'TXN1234567890',
            type: 'Received',
            amount: 1250.00,
            date: '2025-05-19'
        },
        {
            id: 'TXN9876543210',
            type: 'Received',
            amount: 3500.00,
            date: '2025-05-18'
        },
        {
            id: 'TXN5678901234',
            type: 'Sent',
            amount: 800.00,
            date: '2025-05-17'
        }
    ]);

    const handleAddMoney = async (amount) => {
        console.log('Initiating payment for:', amount);

        try {
            // TODO: Open payment gateway (Razorpay, Paytm, etc.)
            // For now, simulating payment processing
            console.log('Opening payment gateway...');

            // Simulate payment gateway processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Payment successful - update wallet and add transaction
            setWalletBalance(prev => prev + amount);

            // Add transaction
            const newTransaction = {
                id: `TXN${Date.now()}`,
                type: 'Received',
                amount: amount,
                date: new Date().toISOString().split('T')[0]
            };
            setTransactions(prev => [newTransaction, ...prev]);

            // Show success modal after successful payment
            setAddedAmount(amount);
            setShowSuccessModal(true);

        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        }
    };

    const handleSaveUpi = (upiId) => {
        console.log('Saving UPI:', upiId);
        setSavedUpiId(upiId);
        alert('UPI ID saved successfully!');
    };

    const handleShowMoreTransactions = () => {
        console.log('Loading more transactions...');
        // Add pagination logic here
    };

    return (
        <div className="space-y-8">
            {/* Page Description */}
            <p className="text-gray-500 text-sm">
                Manage your wallet balance and transactions
            </p>

            {/* Wallet and Add Money Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wallet Card */}
                <div>
                    <WalletCard balance={walletBalance} />
                </div>

                {/* Add Money Form */}
                <div>
                    <AddMoneyForm onAddMoney={handleAddMoney} />
                </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Payment Method Section */}
            <PaymentMethod
                savedUpiId={savedUpiId}
                onSave={handleSaveUpi}
                onDiscard={() => console.log('Discarded')}
            />

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Transaction History */}
            <TransactionTable
                transactions={transactions}
                onShowMore={handleShowMoreTransactions}
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="UPI Successfully Added"
                message={`₹${addedAmount.toLocaleString('en-IN')} has been added to your wallet`}
                buttonText="Done"
            />
        </div>
    );
};

export default MyAccountPage;