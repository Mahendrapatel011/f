import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlus, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

// Components
import BusinessNavbar from '../../components/business/BusinessNavbar';
import OfferStats from '../../components/business/offers/OfferStats';
import OfferTabs from '../../components/business/offers/OfferTabs';
import OfferCard from '../../components/business/offers/OfferCard';
import CreateOfferModal from '../../components/business/offers/CreateOfferModal';

const OfferManagement = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [offersRes, testsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/business/offers', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
                    }),
                    axios.get('http://localhost:5000/api/business/tests', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
                    })
                ]);

                if (offersRes.data.success) setOffers(offersRes.data.data);
                if (testsRes.data.success) setTests(testsRes.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handlers
    const handleSaveOffer = async (formData) => {
        try {
            let res;
            if (selectedOffer) {
                res = await axios.put(`http://localhost:5000/api/business/offers/${selectedOffer._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('businessToken')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.success) {
                    setOffers(prev => prev.map(o => o._id === selectedOffer._id ? res.data.data : o));
                    toast.success('Offer updated successfully');
                }
            } else {
                res = await axios.post('http://localhost:5000/api/business/offers', formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('businessToken')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data.success) {
                    setOffers(prev => [res.data.data, ...prev]);
                    toast.success('Offer created successfully');
                }
            }
            setIsModalOpen(false);
            setSelectedOffer(null);
        } catch (error) {
            console.error('Error saving offer:', error);
            toast.error(error.response?.data?.message || 'Error saving offer');
            throw error;
        }
    };

    const handleDeleteOffer = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;
        try {
            const res = await axios.delete(`http://localhost:5000/api/business/offers/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('businessToken')}` }
            });
            if (res.data.success) {
                setOffers(prev => prev.filter(o => o._id !== id));
                toast.success('Offer deleted');
            }
        } catch (error) {
            console.error('Error deleting offer:', error);
            toast.error('Failed to delete offer');
        }
    };

    const handleEdit = (offer) => {
        setSelectedOffer(offer);
        setIsModalOpen(true);
    };

    // Derived State
    const counts = {
        active: offers.filter(o => o.status === 'active').length,
        scheduled: offers.filter(o => o.status === 'scheduled').length,
        expired: offers.filter(o => o.status === 'expired').length
    };

    const stats = {
        active: counts.active,
        scheduled: counts.scheduled,
        bookings: offers.reduce((acc, o) => acc + (o.stats?.bookings || 0), 0),
        revenue: offers.reduce((acc, o) => acc + (o.stats?.revenue || 0), 0)
    };

    const filteredOffers = offers.filter(o => o.status === activeTab);

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
                            <span>Back</span>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Offer Management</h1>
                        <p className="text-gray-500 mt-1">Create and manage promotional offer for your lab services</p>
                    </div>
                    <button
                        onClick={() => { setSelectedOffer(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1a237e] text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#0d1757] transition-all"
                    >
                        <HiOutlinePlus className="text-xl" />
                        <span>Create New Offer</span>
                    </button>
                </div>

                {/* Stats */}
                <OfferStats stats={stats} />

                {/* Content Container */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                    <OfferTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a237e]"></div>
                            </div>
                        ) : filteredOffers.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <HiOutlinePlus className="text-3xl text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">No {activeTab} offers found</h3>
                                <p className="text-gray-500 mt-1">Try creating a new offer to start promoting your services.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {filteredOffers.map(offer => (
                                    <OfferCard
                                        key={offer._id}
                                        offer={offer}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteOffer}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            <CreateOfferModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveOffer}
                tests={tests}
                initialData={selectedOffer}
            />
        </div>
    );
};

export default OfferManagement;
