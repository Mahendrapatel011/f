// components/cart/CartSummary.jsx
import Button from '../common/Button';

const CartSummary = ({
    totalTests = 0,
    homeCollection = 0,
    platformFee = 0,
    discount = 0,
    itemCharges = 0,
    totalAmount = 0,
    onCheckout,
    loading = false,
    couponInput = '',
    onCouponChange,
    onApplyCoupon,
    appliedCoupons = [],
    onRemoveCoupon
}) => {
    const summaryItems = [
        { label: 'Item Subtotal', value: itemCharges },
        { label: 'Offer Savings', value: discount, isNegative: true },
        ...(homeCollection > 0 ? [{ label: 'Home Collection', value: homeCollection, note: '₹40 flat fee for convenience' }] : []),
        { label: 'Platform Fee', value: platformFee, isFree: platformFee === 0 },
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
                            <span className={`text-sm font-medium ${item.isNegative ? 'text-green-600' : 'text-gray-900'}`}>
                                {item.isNegative ? '-' : ''}₹{item.value?.toLocaleString() || '0'}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Coupon Section */}
            <div className="pb-4 mb-4 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Apply Coupon Code</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono font-bold tracking-widest placeholder:font-sans placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
                    />
                    <button
                        onClick={() => onApplyCoupon(couponInput)}
                        className="bg-[#1e3a5f] text-white px-5 rounded-xl text-xs font-bold hover:bg-[#2c4b78] active:scale-[0.98] transition-all"
                    >
                        APPLY
                    </button>
                </div>

                {/* Applied Coupons Lists */}
                {appliedCoupons.length > 0 && (
                    <div className="mt-3 space-y-2">
                        {appliedCoupons.map((code, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg py-2 px-3">
                                <span className="text-[10px] font-bold text-green-700 font-mono italic">"{code}" APPLIED!</span>
                                <button
                                    onClick={() => onRemoveCoupon(code)}
                                    className="text-[10px] font-bold text-red-500 hover:text-red-700"
                                >
                                    REMOVE
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center py-4 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="font-bold text-lg text-gray-900">
                    ₹{totalAmount?.toLocaleString() || '0'}
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