// components/account/PaymentMethod.jsx
import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const PaymentMethod = ({ savedUpiId, onSave, onDiscard }) => {
    const [upiId, setUpiId] = useState(savedUpiId || '');
    const [isEditing, setIsEditing] = useState(!savedUpiId);

    const handleSave = () => {
        if (upiId.trim()) {
            onSave(upiId);
            setIsEditing(false);
        }
    };

    const handleDiscard = () => {
        setUpiId(savedUpiId || '');
        setIsEditing(false);
        if (onDiscard) onDiscard();
    };

    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs text-gray-500 mb-3">
                    * Unused wallet money & refund balance will be automatically transferred to your bank account if not 
                    used within 15 to 30 days.
                </p>
                <h3 className="text-lg font-semibold text-gray-800">Save Your Payment Method</h3>
            </div>

            {/* UPI Option */}
            <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                    <input
                        type="radio"
                        id="upi"
                        name="paymentMethod"
                        checked={true}
                        readOnly
                        className="w-4 h-4 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                    />
                    <label htmlFor="upi" className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">UPI</span>
                        <img 
                            src="/upi-logo.png" 
                            alt="UPI" 
                            className="h-5"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </label>
                </div>

                {/* UPI Input */}
                <div className="ml-7">
                    <label className="text-sm text-gray-600 mb-1 block">UPI ID</label>
                    <Input
                        type="text"
                        name="upiId"
                        placeholder="Enter UPI ID here"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        disabled={!isEditing}
                        className="max-w-sm"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 ml-7">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDiscard}
                        className="!text-gray-600 !border-gray-300 hover:!bg-gray-50"
                    >
                        Discard
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleSave}
                        disabled={!upiId.trim()}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;