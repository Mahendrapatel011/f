import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiLocationMarker, HiX, HiSearch } from 'react-icons/hi';
import { MdMyLocation } from 'react-icons/md';

// ─── Mock Data ─────────────────────────────────────────────────────────────
const POPULAR_CITIES = [
    { city: 'Bhopal', area: 'MP Nagar', pincode: '462011' },
    { city: 'Indore', area: 'Vijay Nagar', pincode: '452010' },
    { city: 'Mumbai', area: 'Andheri', pincode: '400053' },
    { city: 'Delhi', area: 'Connaught Place', pincode: '110001' },
    { city: 'Bangalore', area: 'Koramangala', pincode: '560034' },
    { city: 'Pune', area: 'Kothrud', pincode: '411038' },
];

// ─── Location Dropdown Component ───────────────────────────────────────────
const LocationDropdown = ({ onClose, onSelect }) => {
    const [pincode, setPincode] = useState('');
    const [error, setError] = useState('');
    const [detecting, setDetecting] = useState(false);
    const [popularCities, setPopularCities] = useState([]);
    const inputRef = useRef(null);

    // Auto focus input and fetch areas
    useEffect(() => {
        inputRef.current?.focus();
        const fetchAreas = async () => {
            try {
                // Adjust base URL if needed, depending on how proxy is set up. Using absolute url for dev.
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${API_URL}/public/areas`);
                const result = await response.json();
                if (result.success) {
                    const locations = [];
                    result.data.forEach(area => {
                        const city = area.name;
                        const defaultPincode = area.pincodes && area.pincodes.length > 0 ? area.pincodes[0] : '';

                        if (area.subAreas && area.subAreas.length > 0) {
                            area.subAreas.forEach(sub => {
                                locations.push({
                                    city: city,
                                    area: sub,
                                    pincode: defaultPincode,
                                    allPincodes: area.pincodes
                                });
                            });
                        } else {
                            locations.push({
                                city: city,
                                area: city,
                                pincode: defaultPincode,
                                allPincodes: area.pincodes
                            });
                        }
                    });
                    setPopularCities(locations);
                }
            } catch (err) {
                console.error('Failed to fetch areas:', err);
                setPopularCities(POPULAR_CITIES); // fallback to hardcoded
            }
        };
        fetchAreas();
    }, []);

    const handlePincodeSubmit = () => {
        if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
            setError('Please enter a valid 6-digit pincode');
            return;
        }

        // Try to match entered pincode with backend loaded areas
        const match = popularCities.find(c => c.allPincodes && c.allPincodes.includes(pincode));
        if (match) {
            onSelect({ pincode, city: match.city, area: 'Delivery Area' });
        } else {
            onSelect({ pincode, city: 'Unknown City', area: 'Custom Area' });
        }
        onClose();
    };

    const handleDetectLocation = () => {
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    // Use OpenStreetMap Nominatim for free reverse geocoding
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                    const data = await res.json();

                    const pincode = data.address.postcode || 'N/A';
                    const city = data.address.city || data.address.state_district || 'Unknown City';
                    const area = data.address.suburb || data.address.neighbourhood || data.address.town || city;

                    onSelect({ pincode, city, area });
                } catch (e) {
                    console.error("Reverse geocoding failed", e);
                    setError('Could not detect location details.');
                } finally {
                    setDetecting(false);
                    onClose();
                }
            },
            () => {
                setError('Location access denied. Please enter pincode manually.');
                setDetecting(false);
            }
        );
    };

    return (
        <div className="absolute top-full left-0 mt-2 w-[320px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-[#1e3a5f]">Select Delivery Location</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <HiX size={18} />
                </button>
            </div>

            <div className="p-4 space-y-4">

                {/* Detect My Location */}
                <button
                    onClick={handleDetectLocation}
                    disabled={detecting}
                    className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg border border-dashed border-[#1e3a5f] text-[#1e3a5f] hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                    <MdMyLocation size={18} className={detecting ? 'animate-spin' : ''} />
                    {detecting ? 'Detecting...' : 'Use My Current Location'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Pincode Input */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={pincode}
                            onChange={(e) => {
                                setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                setError('');
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handlePincodeSubmit()}
                            placeholder="Enter 6-digit pincode"
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]"
                            maxLength={6}
                        />
                        <button
                            onClick={handlePincodeSubmit}
                            className="bg-[#1e3a5f] text-white px-4 rounded-lg text-sm font-medium hover:bg-[#2d5a8e] transition-colors flex items-center"
                        >
                            <HiSearch size={16} />
                        </button>
                    </div>
                    {error && <p className="text-xs text-[#e23744]">{error}</p>}
                </div>

                {/* Popular Cities */}
                <div>
                    <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
                        Available Areas
                    </p>
                    <div className="space-y-1 max-h-[180px] overflow-y-auto">
                        {popularCities.map((loc, idx) => (
                            <button
                                key={idx}
                                onClick={() => { onSelect(loc); onClose(); }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <HiLocationMarker size={14} className="text-[#e23744]" />
                                    <span className="text-sm text-gray-700 group-hover:text-[#1e3a5f] font-medium">
                                        {loc.area}, {loc.city}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-400">{loc.pincode}</span>
                            </button>
                        ))}
                        {popularCities.length === 0 && (
                            <p className="text-center text-xs text-gray-400 py-2">Loading areas...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Auth Navbar ───────────────────────────────────────────────────────────
const AuthNavbar = () => {
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        city: 'Bhopal',
        area: 'Indrapuri',
        pincode: '462022',
    });
    const dropdownRef = useRef(null);

    // Outside click se close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowLocationDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocationSelect = (newLocation) => {
        setSelectedLocation(newLocation);
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
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

                    {/* Location Box with Dropdown */}
                    <div className="relative hidden sm:block" ref={dropdownRef}>
                        <button
                            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                            className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-all cursor-pointer min-w-[180px] ${showLocationDropdown
                                ? 'border-[#1e3a5f] ring-1 ring-[#1e3a5f]'
                                : 'border-gray-200 shadow-sm hover:shadow-md'
                                }`}
                        >
                            <span className="text-[#e23744]">
                                <HiLocationMarker size={18} />
                            </span>
                            <div className="flex flex-col text-left flex-1">
                                <span className="text-[10px] text-gray-400 font-medium leading-none">
                                    {selectedLocation.area}, {selectedLocation.city},
                                </span>
                                <span className="text-[10px] text-gray-500 font-bold leading-tight">
                                    {selectedLocation.pincode}
                                </span>
                            </div>
                            {/* Chevron */}
                            <svg
                                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : ''
                                    }`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown */}
                        {showLocationDropdown && (
                            <LocationDropdown
                                onClose={() => setShowLocationDropdown(false)}
                                onSelect={handleLocationSelect}
                            />
                        )}
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