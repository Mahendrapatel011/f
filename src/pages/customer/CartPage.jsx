// pages/CartPage.jsx
import { useState, useMemo } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import {
    CartHeader,
    DeliveryAddress,
    CartItem,
    CartEmpty,
    CartSummary,
    AddAddressModal,
    ChangeAddressModal,
    AddressSuccessModal
} from '../../components/cart';
import PathologyCarousel from '../../components/common/PathologyCarousel';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const CartPage = () => {
    const { cart, loading, removeFromCart, toggleSelection, clearCart } = useCart();
    const { user, token } = useAuth();

    // Convert cart items to easier format
    const cartItems = cart?.items?.map(item => ({
        id: item.test._id,
        name: item.test.business?.businessName || 'Lab Name',
        image: (item.test.images && item.test.images[0]) || (item.test.business?.profileImage) || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300',
        rating: item.test.business?.rating || 0,
        reviews: item.test.business?.reviews || 0,
        price: item.test.price || 0,
        originalPrice: null, // Test model doesn't have originalPrice currently
        discount: null,
        testName: item.test.name,
        isSelected: item.isSelected
    })) || [];

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [addressLoading, setAddressLoading] = useState(false);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!token) return;
            setAddressLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/auth/addresses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    const mapped = res.data.data.map(addr => ({
                        id: addr._id,
                        name: addr.name,
                        address: addr.addressLine,
                        city: addr.city,
                        state: addr.state,
                        pincode: addr.pincode,
                        country: addr.country
                    }));
                    setSavedAddresses(mapped);
                    // Select default or first address
                    if (mapped.length > 0) setSelectedAddress(mapped[0]);
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            } finally {
                setAddressLoading(false);
            }
        };
        fetchAddresses();
    }, [token]);

    // Modal states
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
    const [isChangeAddressOpen, setIsChangeAddressOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const [exploreItems, setExploreItems] = useState([]);

    // Fetch exploration items
    useEffect(() => {
        const fetchExplore = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/public/labs');
                if (res.data.success) {
                    const mapped = res.data.data.slice(0, 8).map(t => ({
                        id: t._id,
                        name: t.businessName,
                        image: (t.images && t.images[0]) || t.businessLogo,
                        rating: t.rating,
                        reviews: t.reviews,
                        price: t.price,
                        testName: t.name
                    }));
                    setExploreItems(mapped);
                }
            } catch (error) {
                console.error('Error fetching explore items:', error);
            }
        };
        fetchExplore();
    }, []);

    // Calculations
    const selectedItems = cartItems.filter(item => item.isSelected);
    const cartSummary = useMemo(() => {
        const itemCharges = selectedItems.reduce((sum, item) => sum + item.price, 0);
        const originalTotal = selectedItems.reduce((sum, item) => sum + (item.originalPrice || item.price), 0);
        const discount = originalTotal - itemCharges;
        const homeCollection = selectedItems.length > 0 ? 40 : 0;
        const platformFee = 0;
        const totalAmount = itemCharges;
        const savingPrice = discount;

        return {
            totalTests: selectedItems.length,
            homeCollection,
            platformFee,
            discount,
            itemCharges,
            savingPrice,
            totalAmount
        };
    }, [selectedItems]);

    // Handlers
    const handleSelectItem = (id) => {
        toggleSelection(id);
    };

    const handleSelectAll = async () => {
        const allSelected = cartItems.every(item => item.isSelected);
        // This is a bit inefficient via API, but following the pattern
        for (const item of cartItems) {
            if (item.isSelected === allSelected) {
                await toggleSelection(item.id);
            }
        }
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const handleRemoveSelected = async () => {
        const selected = cartItems.filter(item => item.isSelected);
        for (const item of selected) {
            await removeFromCart(item.id);
        }
    };

    const handleAddAddress = async (addressData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/addresses', addressData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const mapped = res.data.data.map(addr => ({
                    id: addr._id,
                    name: addr.name,
                    address: addr.addressLine,
                    city: addr.city,
                    state: addr.state,
                    pincode: addr.pincode,
                    country: addr.country
                }));
                setSavedAddresses(mapped);
                const newAddr = mapped[mapped.length - 1];
                setSelectedAddress(newAddr);
                setIsAddAddressOpen(false);
                setIsSuccessOpen(true);
                toast.success('Address saved successfully');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        }
    };

    const handleSelectAddress = (addressId) => {
        const address = savedAddresses.find(a => a.id === addressId);
        setSelectedAddress(address);
        setIsChangeAddressOpen(false);
        setIsSuccessOpen(true);
    };

    const handleCheckout = () => {
        console.log('Proceeding to checkout with:', {
            items: selectedItems,
            address: selectedAddress,
            summary: cartSummary
        });
    };

    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <CartHeader title="My Cart" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Section - Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Delivery Address */}
                        <DeliveryAddress
                            address={selectedAddress}
                            loading={addressLoading}
                            onAddAddress={() => setIsAddAddressOpen(true)}
                            onChangeAddress={() => setIsChangeAddressOpen(true)}
                        />

                        {isCartEmpty ? (
                            <CartEmpty />
                        ) : (
                            <>
                                {/* Selection Controls */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={handleRemoveSelected}
                                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                                    >
                                        Remove Selected
                                    </button>
                                    <button
                                        onClick={handleSelectAll}
                                        className="text-sm text-[#1e3a5f] hover:underline font-medium"
                                    >
                                        {cartItems.every(item => item.isSelected) ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>

                                {/* Cart Items */}
                                <div className="flex flex-wrap gap-4">
                                    {cartItems.map(item => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            isSelected={item.isSelected}
                                            onSelect={handleSelectItem}
                                            onRemove={handleRemoveItem}
                                        />
                                    ))}
                                </div>

                                {/* Cancellation Policy */}
                                <div className="flex items-start gap-2 p-4 bg-red-50 rounded-lg border border-red-100">
                                    <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-600">
                                        <span className="font-medium">Cancellation Policy:</span> Once the lab person takes your blood, the booking cannot be cancelled.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Section - Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            {...cartSummary}
                            onCheckout={handleCheckout}
                        />
                    </div>
                </div>

                {/* Continue Exploring */}
                <PathologyCarousel
                    title="Continue Exploring"
                    items={exploreItems}
                />

                {/* Modals */}
                <AddAddressModal
                    isOpen={isAddAddressOpen}
                    onClose={() => setIsAddAddressOpen(false)}
                    onSave={handleAddAddress}
                />

                <ChangeAddressModal
                    isOpen={isChangeAddressOpen}
                    onClose={() => setIsChangeAddressOpen(false)}
                    addresses={savedAddresses}
                    selectedAddressId={selectedAddress?.id}
                    onSelectAddress={handleSelectAddress}
                    onAddNewAddress={() => {
                        setIsChangeAddressOpen(false);
                        setIsAddAddressOpen(true);
                    }}
                />

                <AddressSuccessModal
                    isOpen={isSuccessOpen}
                    onClose={() => setIsSuccessOpen(false)}
                    address={selectedAddress}
                />
            </div>
        </div>
    );
};

export default CartPage;