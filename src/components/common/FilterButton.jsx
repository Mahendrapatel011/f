// components/common/FilterButton.jsx
import { FaFilter } from 'react-icons/fa';

const FilterButton = ({ 
    onClick, 
    activeFiltersCount = 0,
    className = '' 
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg
                text-sm text-gray-700 hover:border-[#1e3a5f] hover:text-[#1e3a5f] 
                transition-colors bg-white relative ${className}`}
        >
            <FaFilter className="text-sm" />
            <span>Filters</span>
            
            {/* Active Filters Badge */}
            {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#1e3a5f] text-white 
                    text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                </span>
            )}
        </button>
    );
};

export default FilterButton;