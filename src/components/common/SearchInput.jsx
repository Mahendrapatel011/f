// components/common/SearchInput.jsx
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ 
    value, 
    onChange, 
    placeholder = 'Search...', 
    className = '' 
}) => {
    return (
        <div className={`relative ${className}`}>
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    w-full pl-9 pr-4 py-2
                    border border-gray-300 rounded-lg
                    text-sm text-gray-700
                    placeholder-gray-400
                    focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]
                    transition-colors
                "
            />
        </div>
    );
};

export default SearchInput;