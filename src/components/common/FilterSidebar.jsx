// src/components/common/FilterSidebar.jsx
import { useState } from 'react';
import { FaFilter, FaPlus, FaMinus } from 'react-icons/fa';
import { Button } from './index';

const FilterSection = ({ title, options, selectedOptions, onOptionChange, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-100 last:border-0 py-4">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full text-left group"
            >
                <span className="text-gray-800 font-semibold text-sm group-hover:text-[#1e3a5f] transition-colors">{title}</span>
                <div className={`p-1.5 rounded-full transition-colors ${isOpen ? 'bg-[#1e3a5f]/10 text-[#1e3a5f]' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                    {isOpen ? (
                        <FaMinus className="w-3 h-3" />
                    ) : (
                        <FaPlus className="w-3 h-3" />
                    )}
                </div>
            </button>

            {isOpen && options && (
                <div className="mt-3 space-y-2.5 animate-fadeIn">
                    {options.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group/item">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedOptions?.includes(option.value)}
                                    onChange={() => onOptionChange(option.value)}
                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded checked:bg-[#1e3a5f] checked:border-[#1e3a5f] focus:ring-0 focus:ring-offset-0 transition-all"
                                />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5 transition-opacity" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-600 group-hover/item:text-gray-900 transition-colors">{option.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const FilterSidebar = ({ filters, selectedFilters, onFilterChange, onApply, onReset }) => {
    const [openSections, setOpenSections] = useState({});

    // Initialize all sections as open by default or based on logic
    // For now, keeping them closed by default or letting user toggle

    const toggleSection = (sectionKey) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    const handleOptionChange = (filterKey, optionValue) => {
        const currentSelected = selectedFilters[filterKey] || [];
        const newSelected = currentSelected.includes(optionValue)
            ? currentSelected.filter(v => v !== optionValue)
            : [...currentSelected, optionValue];

        onFilterChange(filterKey, newSelected);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 p-5 border-b border-gray-100 bg-white z-10">
                <FaFilter className="w-4 h-4 text-[#1e3a5f]" />
                <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
            </div>

            {/* Scrollable Filter Sections */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {filters.map((filter) => (
                    <FilterSection
                        key={filter.key}
                        title={filter.title}
                        options={filter.options}
                        selectedOptions={selectedFilters[filter.key]}
                        onOptionChange={(value) => handleOptionChange(filter.key, value)}
                        isOpen={openSections[filter.key]}
                        onToggle={() => toggleSection(filter.key)}
                    />
                ))}
            </div>

            {/* Apply Button Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 bottom-0">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onApply}
                    className="w-full py-2.5 shadow-sm hover:shadow-md transition-all font-medium"
                >
                    Apply
                </Button>
            </div>
        </div>
    );
};

export default FilterSidebar;