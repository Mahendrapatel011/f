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

const CartPage = () => {
    // State
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Pathology Name',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300',
            rating: 3.0,
            reviews: 70,
            price: 3000,
            originalPrice: 5000,
            discount: 40,
            testName: 'CBC Test',
            isSelected: true
        },
        {
            id: 2,
            name: 'Pathology Name',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300',
            rating: 3.0,
            reviews: 74,
            price: 3000,
            originalPrice: 5000,
            discount: 40,
            testName: 'CBC Test',
            isSelected: true
        }
    ]);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([
        {
            id: 1,
            name: 'John Doe',
            address: '354A, Ishan Park, Patel Nagar',
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            pincode: '462022',
            country: 'India'
        },
        {
            id: 2,
            name: 'John Doe',
            address: '354A, Ishan Park, Patel Nagar',
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            pincode: '462023',
            country: 'India'
        }
    ]);

    // Modal states
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
    const [isChangeAddressOpen, setIsChangeAddressOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Continue exploring items
    const exploreItems = [
        {
            id: 101,
            name: 'Pathology Name',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300',
            rating: 4.5,
            reviews: 120,
            price: 3000,
            originalPrice: 5000,
            discount: 35,
            testName: 'CBC Test'
        },
        {
            id: 102,
            name: 'Pathology Name',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300',
            rating: 4.2,
            reviews: 85,
            price: 3000,
            originalPrice: 5000,
            discount: 35,
            testName: 'Lipid Profile'
        },
        {
            id: 103,
            name: 'Pathology Name',
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300',
            rating: 4.8,
            reviews: 200,
            price: 3000,
            originalPrice: 5000,
            discount: 35,
            testName: 'Thyroid Profile'
        }
    ];

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
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isSelected: !item.isSelected } : item
            )
        );
    };

    const handleSelectAll = () => {
        const allSelected = cartItems.every(item => item.isSelected);
        setCartItems(prev =>
            prev.map(item => ({ ...item, isSelected: !allSelected }))
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleRemoveSelected = () => {
        setCartItems(prev => prev.filter(item => !item.isSelected));
    };

    const handleAddAddress = (addressData) => {
        const newAddress = {
            id: Date.now(),
            ...addressData
        };
        setSavedAddresses(prev => [...prev, newAddress]);
        setSelectedAddress(newAddress);
        setIsAddAddressOpen(false);
        setIsSuccessOpen(true);
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