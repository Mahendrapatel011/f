// src/components/common/SearchBar.jsx
import { FaSearch, FaMicrophone } from 'react-icons/fa';

const SearchBar = ({ 
    placeholder = "Search by name / location", 
    value, 
    onChange,
    onSearch,
    onVoiceSearch,
    className = ""
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <div className={`relative flex items-center w-full max-w-2xl mx-auto ${className}`}>
            <div className="relative w-full">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-sm"
                />
                {onVoiceSearch && (
                    <button
                        onClick={onVoiceSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e3a5f] transition-colors"
                    >
                        <FaMicrophone className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;