import React from 'react';
import { HiOutlineEye, HiOutlineShoppingCart, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const OfferCard = ({ offer, onEdit, onDelete }) => {
    const isExpired = offer.status === 'expired';
    const isScheduled = offer.status === 'scheduled';
    const isActive = offer.status === 'active';
    const isPending = offer.status === 'pending';
    const isRejected = offer.status === 'rejected';

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col h-full relative group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 pr-12">
                    {offer.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${isActive ? 'bg-blue-100 text-[#1a237e]' :
                        isScheduled ? 'bg-gray-100 text-gray-600' :
                            isPending ? 'bg-yellow-100 text-yellow-700' :
                                isRejected ? 'bg-red-100 text-red-700' :
                                    'bg-red-50 text-red-600'}`}>
                    {offer.status}
                </span>
            </div>

            <div className="flex items-center gap-4 text-gray-400 text-xs mb-6">
                <div className="flex items-center gap-1">
                    <HiOutlineEye className="text-sm" />
                    <span>{offer.stats?.views || 0} view</span>
                </div>
                <div className="flex items-center gap-1">
                    <HiOutlineShoppingCart className="text-sm" />
                    <span>{offer.stats?.bookings || 0} booking</span>
                </div>
            </div>

            <div className="space-y-3 flex-grow">
                <div className="flex text-sm">
                    <span className="text-gray-500 w-24 flex-shrink-0">Tests:</span>
                    <span className="text-gray-800 font-medium line-clamp-1">
                        {offer.isAllTests ? 'All Tests' : offer.applicableTests?.map(t => t.name).join(', ')}
                    </span>
                </div>
                <div className="flex text-sm">
                    <span className="text-gray-500 w-24 flex-shrink-0">Discount:</span>
                    <span className="text-gray-800 font-medium">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                    </span>
                </div>
                {isScheduled ? (
                    <>
                        <div className="flex text-sm">
                            <span className="text-gray-500 w-24 flex-shrink-0">Start:</span>
                            <span className="text-gray-800 font-medium">{formatDate(offer.startDate)}</span>
                        </div>
                        <div className="flex text-sm">
                            <span className="text-gray-500 w-24 flex-shrink-0">End:</span>
                            <span className="text-gray-800 font-medium">{formatDate(offer.endDate)}</span>
                        </div>
                    </>
                ) : (
                    <div className="flex text-sm">
                        <span className="text-gray-500 w-24 flex-shrink-0">{isExpired ? 'Expired:' : 'Valid until:'}</span>
                        <span className="text-gray-800 font-medium">{formatDate(offer.endDate)}</span>
                    </div>
                )}
                {offer.offerCode && (
                    <div className="flex text-sm">
                        <span className="text-gray-500 w-24 flex-shrink-0">Code:</span>
                        <span className="text-[#1a237e] font-bold uppercase">{offer.offerCode}</span>
                    </div>
                )}
                {isExpired && offer.stats?.revenue > 0 && (
                    <div className="flex text-sm">
                        <span className="text-gray-500 w-24 flex-shrink-0">Revenue:</span>
                        <span className="text-green-600 font-bold">₹{offer.stats.revenue.toLocaleString()}</span>
                    </div>
                )}
                {offer.eligibility?.minOrderValue > 0 && (
                    <div className="flex text-sm">
                        <span className="text-gray-500 w-24 flex-shrink-0">Min Order:</span>
                        <span className="text-gray-800 font-medium">₹{offer.eligibility.minOrderValue}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-3 mt-8">
                {isExpired ? (
                    <button
                        disabled
                        className="flex-1 py-2.5 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed opacity-70"
                    >
                        Archived
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onEdit(offer)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a237e] text-white rounded-lg font-medium hover:bg-[#0d1757] transition-all"
                        >
                            <HiOutlinePencil />
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => onDelete(offer._id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#ef4444] text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                        >
                            <HiOutlineTrash />
                            <span>Delete</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OfferCard;
