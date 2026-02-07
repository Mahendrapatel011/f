import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiLocationMarker, HiShoppingCart, HiHome, HiUserCircle, HiSun, HiMoon } from 'react-icons/hi';
import { useLocationContext } from '../../context/LocationContext';

const LoggedInNavbar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const { location: userLocation, updateLocation } = useLocationContext();
    const location = useLocation(); // Router location
    const isProfilePage = location.pathname === '/profile';
    const isCartPage = location.pathname === '/cart';
    const showHomeIcon = isProfilePage || isCartPage;

    const handleLocationClick = () => {
        const newPincode = prompt('Enter Pincode:', userLocation.pincode);
        if (newPincode) {
            updateLocation({
                ...userLocation,
                pincode: newPincode,
                // In a real app, fetch City/Area from Pincode API
                city: 'Bhopal',
                area: 'Custom Area'
            });
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[80px] md:h-[90px]">

                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/listing" className="flex items-center shrink-0">
                            <img
                                src="/src/assets/images/logo.png"
                                alt="Healthorate Logo"
                                className="w-40 md:w-32 h-16 md:h-28 object-contain"
                            />
                        </Link>

                        {/* Location Box */}
                        <div
                            onClick={handleLocationClick}
                            className="hidden sm:flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors cursor-pointer min-w-[180px]"
                        >
                            <span className="text-[#e23744]">
                                <HiLocationMarker size={20} />
                            </span>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-medium leading-none">{userLocation.area}, {userLocation.city},</span>
                                <span className="text-[11px] text-[#1e3a5f] font-bold leading-tight">{userLocation.pincode}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8">
                        {/* Theme Toggle */}
                        {/* <div className="flex items-center">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`relative inline-flex h-8 w-16 items-center rounded-full border-2 border-gray-200 transition-colors focus:outline-none bg-gray-50`}
                            >
                                <span className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full transition-transform transform ${darkMode ? 'translate-x-[32px] bg-[#1e3a5f]' : 'translate-x-0 bg-white shadow-sm'}`}>
                                    {darkMode ? <HiMoon className="text-white text-xs" /> : <HiSun className="text-yellow-500 text-xs" />}
                                </span>
                                <div className="w-full flex justify-between px-2">
                                    <HiSun className={`text-sm ${darkMode ? 'text-gray-300' : 'text-yellow-500'}`} />
                                    <HiMoon className={`text-sm ${darkMode ? 'text-white' : 'text-gray-300'}`} />
                                </div>
                            </button>
                        </div> */}

                        {/* Cart */}
                        <Link to="/cart" className="relative text-[#1e3a5f] hover:text-[#2d5a8e] transition-colors p-2">
                            <HiShoppingCart size={28} />
                            <span className="absolute top-1 right-1 w-4 h-4 bg-[#e23744] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                0
                            </span>
                        </Link>

                        {/* Conditional: Home icon on profile/cart page, Profile icon elsewhere */}
                        {showHomeIcon ? (
                            <Link to="/listing" className="text-[#1e3a5f] hover:text-[#2d5a8e] transition-colors p-1">
                                <HiHome size={36} />
                            </Link>
                        ) : (
                            <Link to="/profile" className="text-[#1e3a5f] hover:text-[#2d5a8e] transition-colors p-1">
                                <HiUserCircle size={36} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LoggedInNavbar;
