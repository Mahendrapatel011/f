// components/ProfileSidebar.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaUser,
    FaUserCog,
    FaFileAlt,
    FaKey,
    FaTrash,
    FaQuestionCircle,
    FaSignOutAlt,
    FaTimes
} from 'react-icons/fa';
import authService from '../../services/authService';
import ConfirmModal from '../common/ConfirmModal';



const ProfileSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: FaUser },
        { id: 'account', label: 'My Account', icon: FaUserCog },
        { id: 'report', label: 'My Report', icon: FaFileAlt },
        { id: 'password', label: 'Reset Password', icon: FaKey },
        { id: 'delete', label: 'Delete Account', icon: FaTrash },
        { id: 'help', label: 'Help & Support', icon: FaQuestionCircle },
    ];

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        console.log('Logging out...');
        authService.logout();
        setShowLogoutModal(false);
    };

    const handleMenuClick = (id) => {
        setActiveTab(id);
        onClose(); // Close sidebar on mobile after selection
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed md:relative top-0 left-0 h-full md:h-auto
                    w-72 md:w-64 
                    bg-white 
                    rounded-none md:rounded-xl 
                    shadow-xl md:shadow-md 
                    p-4 
                    z-50 md:z-auto
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 md:hidden">
                    <h2 className="text-xl font-semibold text-[#1e3a5f]">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg
                                    transition-all duration-200 text-left
                                    ${isActive
                                        ? 'bg-[#1e3a5f] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <Icon className="text-lg" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg
                            text-gray-600 hover:bg-red-50 hover:text-[#E11D48]
                            transition-all duration-200 text-left"
                    >
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmLogout}
                title="Logout"
                message="Are you sure you want to logout? You will be logged out from your account."
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
};

export default ProfileSidebar;
