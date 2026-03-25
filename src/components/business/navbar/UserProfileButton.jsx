// components/business/navbar/UserProfileButton.jsx
import { FaChevronDown, FaChevronUp, FaUser } from 'react-icons/fa';

const UserProfileButton = ({ userData, onClick, isOpen }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
        >
            {/* Profile Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-200">
                {userData.profileImage ? (
                    <img
                        src={userData.profileImage.startsWith('http') || userData.profileImage.startsWith('data:')
                            ? userData.profileImage
                            : `http://localhost:5000/${userData.profileImage.replace(/\\/g, '/')}`}
                        alt={userData.ownerName || userData.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-lg font-bold text-blue-600">
                        {(userData.ownerName || userData.name || 'U').charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            {/* User Info - Hidden on mobile */}
            <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-800 leading-tight capitalize">
                    {userData.ownerName || userData.name}
                </span>
                <span className="text-xs text-gray-500 leading-tight capitalize">
                    {userData.businessName}
                </span>
            </div>

            {/* Dropdown Arrow */}
            <div className="hidden md:block">
                {isOpen ? (
                    <FaChevronUp className="w-3 h-3 text-gray-400" />
                ) : (
                    <FaChevronDown className="w-3 h-3 text-gray-400" />
                )}
            </div>
        </button>
    );
};

export default UserProfileButton;