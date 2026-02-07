import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../common';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: 'home' },
        { name: 'Services', path: 'services' },
        { name: 'About us', path: 'about' },
        { name: 'Contact Us', path: 'contact' },
    ];

    const handleNavClick = (e, id) => {
        e.preventDefault();
        if (location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(`/#${id}`);
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[80px] md:h-[100px]">
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0">
                        <img
                            src="/src/assets/images/logo.png"
                            alt="Healthorate Logo"
                            className="w-40 md:w-32 h-16 md:h-32 object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={`#${link.path}`}
                                onClick={(e) => handleNavClick(e, link.path)}
                                className="text-black hover:text-[#1e3a5f] font-medium text-lg transition-colors cursor-pointer"
                            >
                                {link.name}
                            </a>
                        ))}

                        {/* Login Dropdown Button */}
                        <div className="relative">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2"
                            >
                                Login
                                <svg
                                    className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                                    <Link
                                        to="/login/customer"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-[#1e3a5f] transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Customer Login
                                    </Link>
                                    <Link
                                        to="/login/business"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-[#1e3a5f] transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Business Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-[#1e3a5f] p-2"
                        >
                            {isMobileMenuOpen ? <HiX size={32} /> : <HiMenu size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 absolute top-[80px] left-0 w-full shadow-lg">
                    <div className="flex flex-col px-4 gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={`#${link.path}`}
                                onClick={(e) => handleNavClick(e, link.path)}
                                className="text-black hover:text-[#1e3a5f] font-medium text-lg py-2 border-b border-gray-50 cursor-pointer"
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="flex flex-col gap-2 pt-2">
                            <Link
                                to="/login/customer"
                                className="text-gray-700 hover:text-[#1e3a5f] py-2 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Customer Login
                            </Link>
                            <Link
                                to="/login/business"
                                className="text-gray-700 hover:text-[#1e3a5f] py-2 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Business Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
