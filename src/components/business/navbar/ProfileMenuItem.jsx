// components/business/navbar/ProfileMenuItem.jsx
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const ProfileMenuItem = ({ icon, iconBg, iconColor, title, subtitle, link, onClick }) => {
    return (
        <Link 
            to={link}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
        >
            {/* Icon */}
            <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {title}
                </h4>
                <p className="text-xs text-gray-500 truncate">{subtitle}</p>
            </div>

            {/* Arrow */}
            <FaChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
        </Link>
    );
};

export default ProfileMenuItem;