import { Link } from 'react-router-dom';
import { HiHome, HiLocationMarker } from 'react-icons/hi';

const AuthNavbar = () => {
    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50 ">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0">
                        <img
                            src="/src/assets/images/logo.png"
                            alt="Healthorate Logo"
                            className="w-40 md:w-32 h-16 md:h-28 object-contain"
                        />
                    </Link>

                    {/* Location Box - as seen in image */}
                    <div className="hidden sm:flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <span className="text-[#e23744]">
                            <HiLocationMarker size={18} />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-medium leading-none">Indrapuri, Bhopal,</span>
                            <span className="text-[10px] text-gray-500 font-bold leading-tight">462022</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Login Text */}
                    <span className="text-2xl font-bold text-[#1e3a5f] hidden xs:block">Login</span>

                    {/* Home Icon */}
                    <Link
                        to="/"
                        className="text-[#1e3a5f] hover:text-[#2c5282] transition-colors"
                        title="Go to Home"
                    >
                        <HiHome size={32} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default AuthNavbar;
