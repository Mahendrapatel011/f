// pages/CartPage.jsx
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';
import {
    CartHeader,
    DeliveryAddress,
    CartItem,
    CartEmpty,
    CartSummary,
    AddAddressModal,
    ChangeAddressModal,
    AddressSuccessModal,
    AvailableOffers
} from '../../components/cart';
import PathologyCarousel from '../../components/common/PathologyCarousel';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, loading, removeFromCart, toggleSelection, clearCart } = useCart();
    const { user, token } = useAuth();

    // Convert cart items to easier format
    const cartItems = cart?.items?.map(item => ({
        id: item.test._id,
        businessId: item.test.business?._id,
        businessAddress: item.test.business?.address,
        name: item.test.business?.businessName || 'Lab Name',
        image: (item.test.images && item.test.images.length > 0) ?
            (item.test.images[0].startsWith('http') ? item.test.images[0] : `http://localhost:5000/${item.test.images[0].startsWith('/') ? item.test.images[0].slice(1) : item.test.images[0]}`) :
            (item.test.business?.profileImage ? (item.test.business.profileImage.startsWith('http') ? item.test.business.profileImage : `http://localhost:5000/${item.test.business.profileImage.startsWith('/') ? item.test.business.profileImage.slice(1) : item.test.business.profileImage}`) :
                'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300'),
        rating: item.test.business?.rating || 0,
        reviews: item.test.business?.reviews || 0,
        price: item.test.price || 0,
        originalPrice: null, // Test model doesn't have originalPrice currently
        discount: null,
        testName: item.test.name,
        offer: item.test.offer || null,
        isSelected: item.isSelected,
        homeCollection: item.test.homeCollection
    })) || [];

    // Check if home collection is available in cart
    const hasHomeCollection = cartItems.some(item => item.homeCollection);

    const [collectionType, setCollectionType] = useState('home_collection');
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
    const [isLabModalOpen, setIsLabModalOpen] = useState(false);
    const [selectedLab, setSelectedLab] = useState(null);

    const [exploreItems, setExploreItems] = useState([]);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupons, setAppliedCoupons] = useState([]);

    // Fetch exploration items
    useEffect(() => {
        const fetchExplore = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/public/labs');
                if (res.data.success) {
                    const mapped = res.data.data.slice(0, 8).map(t => {
                        let imageUrl = 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600';
                        if (t.images && t.images.length > 0) {
                            const firstImg = t.images[0];
                            imageUrl = firstImg.startsWith('http') ? firstImg : `http://localhost:5000/${firstImg.startsWith('/') ? firstImg.slice(1) : firstImg}`;
                        } else if (t.businessLogo) {
                            imageUrl = t.businessLogo.startsWith('http') ? t.businessLogo : `http://localhost:5000/${t.businessLogo.startsWith('/') ? t.businessLogo.slice(1) : t.businessLogo}`;
                        } else if (t.business?.profileImage) {
                            imageUrl = t.business.profileImage.startsWith('http') ? t.business.profileImage : `http://localhost:5000/${t.business.profileImage.startsWith('/') ? t.business.profileImage.slice(1) : t.business.profileImage}`;
                        }

                        return {
                            id: t._id,
                            name: t.businessName || t.business?.businessName,
                            image: imageUrl,
                            rating: t.rating || t.business?.rating,
                            reviews: t.reviews || t.business?.reviews,
                            price: t.price,
                            testName: t.name
                        };
                    });
                    setExploreItems(mapped);
                }
            } catch (error) {
                console.error('Error fetching explore items:', error);
            }
        };
        fetchExplore();
    }, []);

    // Get all available offers from items in cart
    const availableOffers = useMemo(() => {
        const offers = [];
        cartItems.forEach(item => {
            if (item.offer && item.offer.offerCode) {
                // Avoid duplicates
                if (!offers.find(o => o.offerCode === item.offer.offerCode)) {
                    offers.push({
                        ...item.offer,
                        testName: item.testName
                    });
                }
            }
        });
        return offers;
    }, [cartItems]);

    // Calculations
    const selectedItems = cartItems.filter(item => item.isSelected);
    const cartSummary = useMemo(() => {
        let totalDiscount = 0;
        const itemCharges = selectedItems.reduce((sum, item) => {
            // Apply discount ONLY if the coupon code is in appliedCoupons
            if (item.offer && appliedCoupons.includes(item.offer.offerCode)) {
                const discount = item.offer.discountType === 'percentage'
                    ? (item.price * item.offer.discountValue) / 100
                    : item.offer.discountValue;
                totalDiscount += discount;
            }
            return sum + item.price;
        }, 0);

        const homeCollection = selectedItems.length > 0 ? (collectionType === 'home_collection' ? 40 : 0) : 0;
        const platformFee = 0;
        const totalAmount = Math.max(0, itemCharges - totalDiscount + homeCollection + platformFee);

        return {
            totalTests: selectedItems.length,
            homeCollection,
            platformFee,
            discount: totalDiscount,
            itemCharges,
            totalAmount
        };
    }, [selectedItems, collectionType, appliedCoupons]);

    // Handlers
    const handleApplyCoupon = (code) => {
        if (!code) return;
        const offer = availableOffers.find(o => o.offerCode === code);
        if (offer) {
            if (appliedCoupons.includes(code)) {
                toast.error('Coupon already applied');
                return;
            }
            setAppliedCoupons([...appliedCoupons, code]);
            setCouponInput('');
            toast.success(`Coupon "${code}" applied successfully!`, { icon: '🎉' });
        } else {
            toast.error('Invalid coupon code for items in cart');
        }
    };

    const handleRemoveCoupon = (code) => {
        setAppliedCoupons(appliedCoupons.filter(c => c !== code));
        toast.success(`Coupon "${code}" removed`);
    };

    const handleSelectItem = (id) => {
        toggleSelection(id);
    };

    const handleSelectAll = async () => {
        const allSelected = cartItems.every(item => item.isSelected);
        // Following existing pattern, toggle each
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

    const handleViewLab = (lab) => {
        setSelectedLab(lab);
        setIsLabModalOpen(true);
    };

    const handleSelectAddress = (addressId) => {
        const address = savedAddresses.find(a => a.id === addressId);
        setSelectedAddress(address);
        setIsChangeAddressOpen(false);
        setIsSuccessOpen(true);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error('Please select at least one test to checkout.');
            return;
        }

        const businessIds = new Set(selectedItems.map(item => item.businessId));
        if (businessIds.size > 1) {
            toast.error('You can only checkout multiple tests from a single lab at once.', {
                icon: '🛍️',
                duration: 4000
            });
            return;
        }

        if (collectionType === 'home_collection' && !selectedAddress) {
            toast.error('Please select a collection address');
            return;
        }

        navigate('/checkout', {
            state: {
                items: selectedItems,
                collectionType,
                address: selectedAddress,
                summary: cartSummary
            }
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
                        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            {/* Collection Type Toggle */}
                            {hasHomeCollection && (
                                <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                                    <button
                                        onClick={() => setCollectionType('home_collection')}
                                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${collectionType === 'home_collection' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        🏠 Home Collection
                                    </button>
                                    <button
                                        onClick={() => setCollectionType('lab_visit')}
                                        className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${collectionType === 'lab_visit' ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        🏥 Lab Visit
                                    </button>
                                </div>
                            )}

                            {/* Divider for Desktop */}
                            {hasHomeCollection && <div className="hidden md:block w-px h-10 bg-gray-200 mx-2" />}

                            {/* Address Section */}
                            <div className="flex-1 w-full">
                                {collectionType === 'home_collection' ? (
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Deliver to</p>
                                            {selectedAddress ? (
                                                <div className="flex items-start gap-2">
                                                    <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{selectedAddress.name}</span>
                                                    <span className="text-gray-500 text-sm line-clamp-1">
                                                        {selectedAddress.address}, {selectedAddress.city}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">No address selected</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setIsChangeAddressOpen(true)}
                                            className="text-[#1e3a5f] font-bold text-xs hover:underline whitespace-nowrap"
                                        >
                                            {selectedAddress ? 'Change' : 'Add'} Address
                                        </button>
                                    </div>
                                ) : (
                                    /* Lab Visit - show lab addresses + their tests */
                                    !isCartEmpty && (() => {
                                        const labsGrouped = {};
                                        cartItems.forEach(item => {
                                            if (item.isSelected && item.businessId) {
                                                if (!labsGrouped[item.businessId]) {
                                                    labsGrouped[item.businessId] = {
                                                        id: item.businessId,
                                                        name: item.name,
                                                        address: item.businessAddress,
                                                        tests: []
                                                    };
                                                }
                                                labsGrouped[item.businessId].tests.push(item.testName);
                                            }
                                        });

                                        const labEntries = Object.values(labsGrouped);
                                        const firstLab = labEntries[0];

                                        return firstLab ? (
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Visit Lab At</p>
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">{firstLab.name}</span>
                                                        <span className="text-gray-500 text-sm line-clamp-1">
                                                            {[firstLab.address?.area, firstLab.address?.city].filter(Boolean).join(', ')}
                                                            {labEntries.length > 1 && ` (+${labEntries.length - 1} more)`}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewLab(labEntries)}
                                                    className="text-[#1e3a5f] font-bold text-xs hover:underline whitespace-nowrap"
                                                >
                                                    View Address
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">Select tests to see lab locations</span>
                                        );
                                    })()
                                )}
                            </div>
                        </div>

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

                                {/* Cart Items - horizontal scrollable row */}
                                <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                                    {cartItems.map(item => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            isSelected={item.isSelected}
                                            collectionType={collectionType}
                                            onSelect={handleSelectItem}
                                            onRemove={handleRemoveItem}
                                            isApplied={item.offer && appliedCoupons.includes(item.offer.offerCode)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Section - Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            {...cartSummary}
                            onCheckout={handleCheckout}
                            couponInput={couponInput}
                            onCouponChange={setCouponInput}
                            onApplyCoupon={handleApplyCoupon}
                            appliedCoupons={appliedCoupons}
                            onRemoveCoupon={handleRemoveCoupon}
                        />
                    </div>
                </div>

                {/* Available Offers section */}
                {!isCartEmpty && (
                    <AvailableOffers
                        offers={availableOffers}
                        onApplyCode={handleApplyCoupon}
                    />
                )}

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

                <LabAddressModal
                    isOpen={isLabModalOpen}
                    onClose={() => setIsLabModalOpen(false)}
                    labs={selectedLab}
                />
            </div>
        </div>
    );
};

// Internal Modal components for clean organization
const LabAddressModal = ({ isOpen, onClose, labs }) => {
    if (!isOpen || !labs) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden scale-in-center">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-[#1e3a5f]">🏥 Lab Locations</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>

                    <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
                        {labs.map((lab, i) => (
                            <div key={i} className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">{lab.name}</p>
                                <div className="space-y-3 pb-3 border-b border-blue-100/50 mb-3">
                                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                        {Object.values(lab.address || {}).filter(v => typeof v === 'string').join(', ')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Applied Tests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {lab.tests.map((test, idx) => (
                                            <span key={idx} className="bg-white px-3 py-1 rounded-full text-[11px] text-[#1e3a5f] font-semibold border border-blue-100 italic">
                                                {test}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                        <Button
                            onClick={onClose}
                            variant="secondary"
                            className="w-full mt-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
                        >
                            Got it
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

export default CartPage;