// components/business/BusinessNavbar.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../assets/images/logo.png';

import UserProfileButton from './navbar/UserProfileButton';
import BusinessProfileSidebar from './navbar/BusinessProfileSidebar';

const BusinessNavbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Business User',
        businessName: 'My Business',
        profileImage: null
    });

    const refreshUserData = async () => {
        try {
            // 1. Try to read from local storage first for immediate render
            const storedData = localStorage.getItem('businessData');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                setUserData(parsed);
            }

            // 2. Fetch fresh data from backend
            const token = localStorage.getItem('businessToken');
            if (!token) return;

            const response = await axios.get('http://localhost:5000/api/business/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const business = response.data.data.business;
                // Update State with FULL business object
                setUserData(business);
                // Update Local Storage
                localStorage.setItem('businessData', JSON.stringify(business));
            }
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    useEffect(() => {
        refreshUserData();
    }, []);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const closeProfile = () => {
        setIsProfileOpen(false);
    };

    return (
        <>
            <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-[60]">
                <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[80px] md:h-[100px]">
                        {/* Logo Section */}
                        <Link to="/business/dashboard" className="flex items-center shrink-0">
                            <img
                                src={logo}
                                alt="Healthorate Logo"
                                className="w-40 md:w-32 h-16 md:h-32 object-contain"
                            />
                        </Link>

                        {/* Right Navigation Items */}
                        <div className="flex items-center gap-6">
                            {/* Notification Bell */}

                            {/* Toggle Lab Status */}
                            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                <span className={`text-[13px] font-semibold ${userData.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                    {userData.isActive ? 'Lab Active' : 'Lab Inactive'}
                                </span>
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('businessToken');
                                            const newStatus = !userData.isActive;
                                            const response = await axios.put('http://localhost:5000/api/business/auth/profile', 
                                                { isActive: newStatus },
                                                { headers: { Authorization: `Bearer ${token}` } }
                                            );
                                            if (response.data.success) {
                                                setUserData({ ...userData, isActive: newStatus });
                                                localStorage.setItem('businessData', JSON.stringify({ ...userData, isActive: newStatus }));
                                            }
                                        } catch (error) {
                                            console.error("Failed to toggle status", error);
                                        }
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none 
                                        ${userData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                            ${userData.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            {/* User Profile */}
                            <UserProfileButton
                                userData={userData}
                                onClick={toggleProfile}
                                isOpen={isProfileOpen}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Sidebar */}
            <BusinessProfileSidebar
                isOpen={isProfileOpen}
                onClose={closeProfile}
                userData={userData}
                onProfileUpdate={refreshUserData}
            />
        </>
    );
};

export default BusinessNavbar;