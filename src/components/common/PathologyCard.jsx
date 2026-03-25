import { FaStar } from 'react-icons/fa';
import { Button } from './index';

const PathologyCard = ({
    image,
    name,
    testName,
    price,
    originalPrice,
    discount,
    rating,
    reviews,
    offer,
    onAddToCart,
    onBookNow,
    onClick,
    className
}) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow ${className || 'w-[280px] flex-shrink-0'} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Image Section */}
            <div className="relative h-[180px]">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />

                {/* Discount Badge */}
                {discount && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {discount}% OFF
                    </span>
                )}

                {/* Offer Badge (Top Right) - From Offer Management */}
                {offer && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm border border-green-400">
                        {offer.title}
                    </span>
                )}

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-sm">
                    <span className="font-medium">{rating}</span>
                    <FaStar className="text-yellow-400 w-3 h-3" />
                    <span className="text-gray-500">| {reviews}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Name & Price Row */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                        {name}
                    </h3>
                    <div className="text-right flex-shrink-0">
                        <span className="font-bold text-[#1e3a5f]">₹{price}</span>
                        {originalPrice && (
                            <span className="text-gray-400 text-sm line-through ml-1">
                                ₹{originalPrice}
                            </span>
                        )}
                    </div>
                </div>

                {/* Test Name */}
                <p className="text-gray-500 text-sm mt-1">{testName}</p>

                {/* Buttons */}
                <div className="flex items-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(e);
                        }}
                        className="flex-1 text-sm py-2 px-0"
                    >
                        Add to Cart
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBookNow?.(e);
                        }}
                        className="flex-1 text-sm py-2 px-0"
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PathologyCard;