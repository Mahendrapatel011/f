import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineArrowLeft, HiOutlineLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

// Components
import BusinessNavbar from '../../components/business/BusinessNavbar';
import ReqAdModal from '../../components/business/dashboard/ReqAdModal';

const AdManagement = () => {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch data
    const fetchData = async () => {
        try {
            const [bannersRes, settingsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/business/banners', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
                }),
                axios.get('http://localhost:5000/api/public/settings')
            ]);

            if (bannersRes.data.success) setBanners(bannersRes.data.data);
            if (settingsRes.data.success) setSettings(settingsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatImagePath = (imgUrl) => {
        if (!imgUrl) return ''
        let normalizedUrl = imgUrl.replace(/\\/g, '/');
        return normalizedUrl.startsWith('http') ? normalizedUrl : `http://localhost:5000/${normalizedUrl.replace('uploads/banners/', 'uploads/')}`
    }

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (banner) => {
        try {
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error("Razorpay SDK failed to load");
                return;
            }

            // Calculate cost (Mock calculation if not stored in DB yet)
            const pincodeCount = banner.pincodes ? banner.pincodes.length : 0;
            const amount = settings.baseAdRate + (pincodeCount * settings.ratePerPincode);

            // Initiate payment on backend
            const token = localStorage.getItem('businessToken');
            const res = await axios.post(`http://localhost:5000/api/business/banners/${banner._id}/pay`, { amount }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const options = {
                    key: "rzp_test_SPY2NC2W6Sqvmb", // Same test key
                    amount: res.data.razorpayOrder.amount,
                    currency: "INR",
                    name: "Healthorate Ads",
                    description: `Ad Promotion: ${banner.title}`,
                    order_id: res.data.razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bannerId: banner._id
                            };

                            const verifyRes = await axios.post('http://localhost:5000/api/business/banners/verify-payment', verifyData, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            if (verifyRes.data.success) {
                                toast.success(verifyRes.data.message);
                                fetchData();
                            }
                        } catch (err) {
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: "Business User",
                    },
                    theme: {
                        color: "#1e3a5f"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
        }
    };

    const getStatusColor = (status, paymentStatus) => {
        if (paymentStatus === 'pending') return 'bg-orange-100 text-orange-700 border-orange-200';
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <BusinessNavbar />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate('/business/dashboard')}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-2 text-sm font-medium"
                        >
                            <HiOutlineArrowLeft />
                            <span>Back to Dashboard</span>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Advertisement Management</h1>
                        <p className="text-gray-500 mt-1">Request and manage banners on the main customer listing page</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#2d4a6f] transition-all"
                    >
                        <HiOutlinePlus className="text-xl" />
                        <span>Request Advertisement</span>
                    </button>
                </div>

                {/* Ad Cost Banner */}
                {settings && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Current Advertisement Rates</h3>
                            <p className="text-gray-500 text-sm mt-1">Advertise your business directly to customers</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
                                <div className="text-xs text-blue-800 font-semibold uppercase tracking-wider mb-1">Base Rate</div>
                                <div className="text-xl font-bold text-blue-600">₹{settings.baseAdRate} <span className="text-sm font-medium text-blue-400">/ Day</span></div>
                            </div>
                            <div className="bg-teal-50 px-4 py-3 rounded-lg border border-teal-100">
                                <div className="text-xs text-teal-800 font-semibold uppercase tracking-wider mb-1">Per Pincode</div>
                                <div className="text-xl font-bold text-teal-600">+₹{settings.ratePerPincode} <span className="text-sm font-medium text-teal-400">/ Area</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ads Grid */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Your Banners</h2>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a237e]"></div>
                            </div>
                        ) : banners.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <HiOutlinePlus className="text-3xl text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">No advertisements found</h3>
                                <p className="text-gray-500 mt-1">Submit an advertisement request to promote your business.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {banners.map((banner) => (
                                    <div key={banner._id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                        <div className="h-40 w-full relative">
                                            <img
                                                src={formatImagePath(banner.image)}
                                                alt={banner.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusColor(banner.status, banner.paymentStatus)}`}>
                                                    {banner.paymentStatus === 'pending' ? 'Waiting for Payment' : banner.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-2">
                                                {banner.title}
                                            </h3>

                                            <div className="mt-auto pt-3 border-t border-gray-100 space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <HiOutlineLocationMarker className="text-gray-400" />
                                                    <span className="truncate">
                                                        {banner.pincodes?.length > 0
                                                            ? banner.pincodes.join(', ')
                                                            : 'All India (Global)'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs mt-3 pt-2">
                                                    <span className="text-gray-500">
                                                        Req: {new Date(banner.createdAt).toLocaleDateString()}
                                                    </span>
                                                    {banner.paymentStatus === 'pending' && banner.status === 'approved' ? (
                                                        <button
                                                            onClick={() => handlePayment(banner)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                                        >
                                                            Pay to Go Live
                                                        </button>
                                                    ) : banner.isActive ? (
                                                        <span className="text-green-600 font-medium">Currently Live</span>
                                                    ) : (
                                                        <span className="text-gray-500">{banner.status === 'pending' ? 'Reviewing Content' : 'Inactive'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            <ReqAdModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    fetchData(); // Refresh data after modal closes to get possible new requests
                }}
            />
        </div>
    );
};

export default AdManagement;
