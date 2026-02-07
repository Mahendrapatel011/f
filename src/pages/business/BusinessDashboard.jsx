// BusinessDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BusinessNavbar from '../../components/business/BusinessNavbar';
import StatsCard from '../../components/business/dashboard/StatsCard';
import ActionButtons from '../../components/business/dashboard/ActionButtons';
import MonthlyAnalytics from '../../components/business/dashboard/MonthlyAnalytics';
import NotificationsPanel from '../../components/business/dashboard/NotificationsPanel';
import { calculateProfileCompletion } from '../../utils/profileCompletion';

const BusinessDashboard = () => {


    const [business, setBusiness] = useState(null);
    const [kycStatus, setKycStatus] = useState('pending'); // pending, submitted, verified, rejected
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                const token = localStorage.getItem('businessToken');
                if (!token) {
                    navigate('/login/business');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/business/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    const data = response.data.data.business;
                    setBusiness(data);
                    setKycStatus(data.kycStatus);

                    // Update local storage just in case
                    localStorage.setItem('businessData', JSON.stringify(data));
                }
            } catch (error) {
                console.error('Error fetching business data:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('businessToken');
                    navigate('/login/business');
                }
            }
        };

        fetchBusinessData();
    }, [navigate]);

    const statsData = [
        { id: 1, title: 'Bookings', value: '121', icon: 'calendar', color: 'blue' },
        { id: 2, title: 'Reports', value: '45', icon: 'document', color: 'yellow' },
        { id: 3, title: 'Patients', value: '350', icon: 'patient', color: 'orange' },
        { id: 4, title: 'Payments', value: '8200', icon: 'rupee', color: 'green' },
    ];

    // Dynamic Notifications based on KYC
    const getNotifications = () => {
        const baseNotifications = [
            {
                id: 1,
                message: 'New booking received from',
                highlight: 'Aman Singh',
                details: 'for 21 June, 10:00 AM',
                time: '20m ago',
                type: 'booking'
            },
            {
                id: 2,
                message: 'Booking cancelled by user',
                highlight: 'Ramesh Kumar',
                details: '(24 June, 3:00 PM).',
                time: '1hr ago',
                type: 'cancel'
            },
        ];

        if (kycStatus === 'verified') {
            baseNotifications.unshift({
                id: 'kyc-approved',
                message: 'Your KYC has been',
                highlight: 'Approved',
                details: '! You can now access all features.',
                time: 'Just now',
                type: 'booking' // reusing positive style
            });
        } else if (kycStatus === 'rejected') {
            baseNotifications.unshift({
                id: 'kyc-rejected',
                message: 'Your KYC has been',
                highlight: 'Rejected',
                details: '. Please re-submit documents.',
                time: 'Just now',
                type: 'cancel' // reusing negative style
            });
        }

        return baseNotifications;
    };

    const notifications = getNotifications();

    // Calculate Profile Completion using centralized utility
    const completionPercentage = calculateProfileCompletion(business);

    return (
        <div className="min-h-screen bg-gray-50">
            <BusinessNavbar />

            <main className="w-full max-w-[1150px] mx-auto px-4 py-6">
                {/* Welcome Header & KYC Alert */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1a237e]">
                        Welcome back, {business?.ownerName || 'Business User'}!
                    </h1>

                    {/* KYC Status Alert */}
                    {kycStatus !== 'verified' && (
                        <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium
                            ${kycStatus === 'submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                kycStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                        >
                            <span className="relative flex h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                                    ${kycStatus === 'submitted' ? 'bg-blue-400' :
                                        kycStatus === 'rejected' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 
                                    ${kycStatus === 'submitted' ? 'bg-blue-500' :
                                        kycStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                            </span>
                            <span>
                                {kycStatus === 'submitted' ? 'KYC Verification Pending' :
                                    kycStatus === 'rejected' ? 'KYC Rejected - ' :
                                        'KYC Pending - Please Complete'}
                            </span>
                            {kycStatus === 'rejected' && (
                                <button
                                    onClick={() => navigate('/kyc/business')}
                                    className="ml-2 px-3 py-1 bg-red-100 text-[#E11D48] hover:bg-red-200 rounded-md text-xs font-bold transition-colors border border-red-300"
                                >
                                    Re-apply for KYC
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {statsData.map((stat) => (
                        <StatsCard key={stat.id} {...stat} />
                    ))}
                </div>

                {/* Action Buttons */}
                <ActionButtons profileCompletion={completionPercentage} />

                {/* Analytics and Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <MonthlyAnalytics />
                    <NotificationsPanel notifications={notifications} />
                </div>
            </main>
        </div>
    );
};

export default BusinessDashboard;