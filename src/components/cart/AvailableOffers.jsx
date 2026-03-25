// components/cart/AvailableOffers.jsx
import React from 'react';
import { FaTag, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AvailableOffers = ({ offers, onApplyCode }) => {
    if (!offers || offers.length === 0) return null;

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
        if (onApplyCode) onApplyCode(code);
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaTag className="text-[#1e3a5f]" />
                Available Offers for your Tests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-2xl border border-dashed border-blue-300 hover:border-blue-500 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                            {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-blue-50 p-2.5 rounded-xl">
                                <FaTag className="text-blue-500 translate-y-[1px]" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm mb-1">{offer.title}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1 mb-3">
                                    Valid on: <span className="text-blue-600 font-medium italic">{offer.testName}</span>
                                </p>

                                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-100">
                                    <span className="text-sm font-mono font-bold text-[#1e3a5f] uppercase tracking-wider">
                                        {offer.offerCode}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(offer.offerCode)}
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                                    >
                                        <FaCopy /> APPLY
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableOffers;
