// components/cart/CartSummary.jsx
import Button from '../common/Button';

const CartSummary = ({ 
    totalTests = 0,
    homeCollection = 0,
    platformFee = 0,
    discount = 0,
    itemCharges = 0,
    savingPrice = 0,
    totalAmount = 0,
    onCheckout,
    loading = false
}) => {
    const summaryItems = [
        { label: 'Home Collection', value: homeCollection, suffix: homeCollection > 0 ? '' : '', note: '₹4 per KM so total is ₹40.' },
        { label: 'Platform Fee', value: platformFee, isFree: platformFee === 0 },
        { label: 'Discount', value: discount },
        { label: 'Item Charges', value: itemCharges },
        { label: 'Saving Price', value: savingPrice },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cart Summary</h2>

            {/* Total Tests */}
            <div className="pb-4 mb-4 border-b border-gray-100">
                <span className="text-gray-600">Total Tests ({totalTests} Tests)</span>
            </div>

            {/* Summary Items */}
            <div className="space-y-3 mb-4">
                {summaryItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                        <div>
                            <span className="text-sm text-gray-600">{item.label}</span>
                            {item.note && (
                                <p className="text-xs text-gray-400">{item.note}</p>
                            )}
                        </div>
                        {item.isFree ? (
                            <span className="text-sm font-medium text-green-600">FREE</span>
                        ) : (
                            <span className="text-sm font-medium text-gray-900">
                                ₹{item.value?.toLocaleString() || '0'}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center py-4 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="font-bold text-lg text-gray-900">
                    ₹{totalAmount?.toLocaleString() || '0,000'}
                </span>
            </div>

            {/* Checkout Button */}
            <Button
                variant="secondary"
                size="md"
                onClick={onCheckout}
                disabled={totalTests === 0 || loading}
                className="w-full mt-2"
            >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
        </div>
    );
};

export default CartSummary;