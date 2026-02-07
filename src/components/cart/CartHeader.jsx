// components/cart/CartHeader.jsx
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartHeader = ({ title = 'My Cart' }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-3 mb-6">
            <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <FaArrowLeft className="text-gray-700 text-lg" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
    );
};

export default CartHeader;