import React from 'react';
import Button from '../common/Button';

const CheckoutSummary = ({
    summary,
    onProceed,
    loading = false,
    buttonText = "Proceed to Checkout"
}) => {
    const {
        homeCollection = 0,
        platformFee = 0,
        discount = 0,
        itemCharges = 0,
        totalAmount = 0
    } = summary;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-6">Order Summary</h3>

            <div className="space-y-4 mb-8">
                {/* Home Collection */}
                <div className="flex justify-between items-start">
                    <div>
                        <span className="text-sm font-medium text-gray-700">Home Collection</span>
                        <p className="text-[10px] text-red-500 font-medium">* Free upto 5 Km.</p>
                    </div>
                    {homeCollection === 0 ? (
                        <span className="text-sm font-bold text-[#1e3a5f]">FREE</span>
                    ) : (
                        <span className="text-sm font-bold text-gray-900">₹{homeCollection}</span>
                    )}
                </div>

                {/* Platform Fee */}
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Platform Fee</span>
                    {platformFee === 0 ? (
                        <span className="text-sm font-bold text-[#1e3a5f]">FREE</span>
                    ) : (
                        <span className="text-sm font-bold text-gray-900">₹{platformFee}</span>
                    )}
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Discount</span>
                    <span className="text-sm font-bold text-gray-900">₹{discount}</span>
                </div>

                {/* Item Charges */}
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Item Charges</span>
                    <span className="text-sm font-bold text-gray-900">₹{itemCharges}</span>
                </div>

                {/* Saving Price */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Saving Price</span>
                    <span className="text-sm font-bold text-gray-900">₹{discount}</span>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">₹{totalAmount}</span>
                </div>
            </div>

            <Button
                onClick={onProceed}
                disabled={loading}
                className="w-full !rounded-xl !py-4 shadow-lg !bg-[#1e3a5f] hover:!bg-[#152943] text-white font-bold"
            >
                {loading ? 'Processing...' : buttonText}
            </Button>
        </div>
    );
};

export default CheckoutSummary;
