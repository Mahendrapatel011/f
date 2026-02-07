// components/cart/CartItem.jsx
import { FaStar } from 'react-icons/fa';
import Button from '../common/Button';

const CartItem = ({
    item,
    isSelected = true,
    onSelect,
    onRemove
}) => {
    const {
        id,
        name,
        image,
        rating,
        reviews,
        price,
        originalPrice,
        discount,
        testName
    } = item;

    return (
        <div className="relative flex flex-col p-4 bg-white rounded-xl border border-gray-200 
            w-full sm:w-[200px] flex-shrink-0">

            {/* Selection Checkbox */}
            {onSelect && (
                <div className="absolute top-3 left-3 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(id)}
                        className="w-4 h-4 text-[#1e3a5f] rounded border-gray-300 
                            focus:ring-[#1e3a5f] cursor-pointer"
                    />
                </div>
            )}

            {/* Discount Badge */}
            {discount && (
                <div className="absolute top-3 right-3 z-10">
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {discount}% OFF
                    </span>
                </div>
            )}

            {/* Image */}
            <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                <img
                    src={image || 'https://via.placeholder.com/200x150?text=Lab'}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                    {name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-sm text-gray-700">{rating}</span>
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-xs text-gray-400">({reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900">₹{price?.toLocaleString()}</span>
                    {originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            ₹{originalPrice?.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Test Name */}
                {testName && (
                    <p className="text-xs text-gray-500 mb-3">{testName}</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onRemove(id)}
                    className="flex-1 !py-2 !px-2 text-xs"
                >
                    Remove
                </Button>
                {onSelect && (
                    <Button
                        variant={isSelected ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => onSelect(id)}
                        className="flex-1 !py-2 !px-2 text-xs"
                    >
                        {isSelected ? 'Selected' : 'Checkout'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CartItem;