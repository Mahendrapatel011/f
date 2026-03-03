import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCart(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (testId) => {
        if (!token) {
            toast.error('Please login to add to cart');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/cart/add', { testId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCart(res.data.data);
                toast.success('Added to cart');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding to cart');
        }
    };

    const removeFromCart = async (testId) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/cart/remove/${testId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCart(res.data.data);
                toast.success('Removed from cart');
            }
        } catch (error) {
            toast.error('Error removing from cart');
        }
    };

    const toggleSelection = async (testId) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/cart/toggle/${testId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCart(res.data.data);
            }
        } catch (error) {
            console.error('Error toggling selection:', error);
        }
    };

    const clearCart = async () => {
        try {
            const res = await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCart({ ...cart, items: [] });
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            removeFromCart,
            toggleSelection,
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
