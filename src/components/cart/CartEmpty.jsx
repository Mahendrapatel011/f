// components/cart/CartEmpty.jsx
import { FaShoppingCart } from 'react-icons/fa';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const CartEmpty = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {/* Cart Icon */}
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FaShoppingCart className="text-4xl text-gray-400" />
            </div>

            {/* Message */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Your cart is empty
            </h3>
            <p className="text-gray-500 text-sm mb-6 text-center">
                Looks like you haven't added any tests yet
            </p>

            {/* Action Button */}
            <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/')}
            >
                Start Booking
            </Button>
        </div>
    );
};

export default CartEmpty;