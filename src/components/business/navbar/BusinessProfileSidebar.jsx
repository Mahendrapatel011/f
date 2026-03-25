// components/business/navbar/BusinessProfileSidebar.jsx
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUser, FaCamera, FaBullhorn } from 'react-icons/fa';
import ProfileMenuItem from './ProfileMenuItem';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineSecurity } from 'react-icons/md';
import { BiSupport } from 'react-icons/bi';
import { useState } from 'react';
import UpdateProfileModal from './UpdateProfileModal';
import { calculateProfileCompletion } from '../../../utils/profileCompletion';

const BusinessProfileSidebar = ({ isOpen, onClose, userData, onProfileUpdate }) => {
    const navigate = useNavigate();
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleProfileUpdate = (newImagePath) => {
        // Trigger parent refresh which fetches fresh data and updates state
        if (onProfileUpdate) {
            onProfileUpdate();
        } else {
            window.location.reload();
        }
    };

    const getImageSrc = (src) => {
        if (!src) return null;
        if (src.startsWith('data:') || src.startsWith('http')) return src;
        return `http://localhost:5000/${src.replace(/\\/g, '/')}`;
    };

    const handleLogout = () => {
        localStorage.removeItem('businessToken');
        localStorage.removeItem('businessData');
        onClose();
        navigate('/login/business');
    };

    const menuItems = [
        {
            id: 1,
            icon: <HiOutlineBuildingOffice2 className="w-5 h-5" />,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            title: 'Business Details',
            subtitle: 'Edit your details',
            link: '/business/details'
        },
        {
            id: 2,
            icon: <MdOutlineSecurity className="w-5 h-5" />,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            title: 'Privacy & Security',
            subtitle: 'Account security settings',
            link: '/business/security'
        },
        {
            id: 3,
            icon: <BiSupport className="w-5 h-5" />,
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            title: 'Help & Support',
            subtitle: 'Get help and contact us',
            link: '/business/support'
        },
        {
            id: 4,
            icon: <FaBullhorn className="w-5 h-5" />, // Replaced with any generic icon or use existing Bi Support if needed.
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            title: 'Payments & Ledger',
            subtitle: 'Track commissions & dues',
            link: '/business/ledger'
        },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Business Profile</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center py-6 border-b border-gray-100">
                        {/* Profile Image with Camera */}
                        <div className="relative mb-3 group cursor-pointer" onClick={() => setShowUpdateModal(true)}>
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-3 border-blue-200">
                                {userData.profileImage ? (
                                    <img
                                        src={getImageSrc(userData.profileImage)}
                                        alt={userData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-blue-600">
                                        {(userData.name || userData.ownerName || 'U').charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {/* Camera Icon */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowUpdateModal(true); }}
                                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors z-10"
                            >
                                <FaCamera className="w-3 h-3 text-white" />
                            </button>
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 capitalize">{userData.name || userData.ownerName}</h3>
                        <p className="text-sm text-gray-500 capitalize">{userData.businessName}</p>

                        {/* Profile Completion Progress */}
                        <div className="w-full px-6 mt-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-600">Profile Completion</span>
                                <span className={`text-xs font-bold ${calculateProfileCompletion(userData) > 75 ? 'text-green-600' : 'text-blue-600'}`}>
                                    {calculateProfileCompletion(userData)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${calculateProfileCompletion(userData) > 75 ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${calculateProfileCompletion(userData)}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-center">
                                {calculateProfileCompletion(userData) < 100 ? 'Complete your profile & KYC to reach 100%' : 'Profile fully completed!'}
                            </p>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 py-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <ProfileMenuItem
                                key={item.id}
                                {...item}
                                onClick={onClose}
                            />
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="w-full py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {/* Update Profile Modal */}
            <UpdateProfileModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                currentImage={userData.profileImage ? getImageSrc(userData.profileImage) : null}
                onUpdate={handleProfileUpdate}
            />
        </>
    );
};

export default BusinessProfileSidebar;