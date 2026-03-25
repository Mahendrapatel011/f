// src/components/common/FilterSidebar.jsx
import { useState } from 'react';
import { FaFilter, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { HiOutlineX } from 'react-icons/hi';
import { Button } from './index';

const FilterSection = ({ filterKey, title, options, selectedOptions, onOptionChange, onClearSection, isOpen, onToggle }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const selectedCount = selectedOptions?.length || 0;

    const filteredOptions = options?.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const selectedFullOptions = (options || []).filter(opt =>
        selectedOptions?.includes(opt.value)
    );

    return (
        <div className="border-b border-gray-100 last:border-0 py-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-bold text-sm tracking-tight">{title}</span>
                    {selectedCount > 0 && (
                        <div className="flex items-center gap-1.5">
                            <span className="bg-[#1e3a5f] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {selectedCount}
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onClearSection(); }}
                                className="text-[#1e3a5f] text-xs hover:underline font-semibold"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
                <button
                    onClick={onToggle}
                    className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-400'}`}
                >
                    {isOpen ? <FaMinus size={10} /> : <FaPlus size={10} />}
                </button>
            </div>

            {isOpen && (
                <div className="space-y-3 animate-fadeIn">
                    {/* Selected Chips */}
                    {selectedCount > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {selectedFullOptions.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="flex items-center gap-1 bg-[#eef2f6] text-[#1e3a5f] px-2 py-1 rounded-md text-[11px] font-bold"
                                >
                                    {opt.label}
                                    <button
                                        onClick={() => onOptionChange(opt.value)}
                                        className="hover:text-red-500"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Search / Input Box like image */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={title}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-gray-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-[#1e3a5f] text-gray-700"
                        />
                    </div>

                    {/* Checkbox List */}
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                        {filteredOptions.map((option) => (
                            <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedOptions?.includes(option.value)}
                                    onChange={() => onOptionChange(option.value)}
                                    className="w-3.5 h-3.5 border-gray-300 rounded text-[#1e3a5f] focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const FilterSidebar = ({ filters, selectedFilters, onFilterChange, onApply }) => {
    const [openSections, setOpenSections] = useState({
        category: true,
        subCategory: true
    });

    const totalApplied = Object.values(selectedFilters).reduce((acc, curr) => acc + (curr?.length || 0), 0);

    const toggleSection = (sectionKey) => {
        setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
    };

    const handleOptionChange = (filterKey, optionValue) => {
        const currentSelected = selectedFilters[filterKey] || [];
        const newSelected = currentSelected.includes(optionValue)
            ? currentSelected.filter(v => v !== optionValue)
            : [...currentSelected, optionValue];
        onFilterChange(filterKey, newSelected);
    };

    const handleClearAll = () => {
        Object.keys(selectedFilters).forEach(key => onFilterChange(key, []));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <FaFilter className="w-3.5 h-3.5 text-gray-800" />
                    <h3 className="font-bold text-gray-800 text-base">Filters</h3>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">
                        {totalApplied} filters applied
                    </span>
                    {totalApplied > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-1 text-[#1e3a5f] hover:underline text-[11px] font-bold"
                        >
                            <HiOutlineX size={14} />
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                {filters.map((filter) => (
                    <FilterSection
                        key={filter.key}
                        filterKey={filter.key}
                        title={filter.title}
                        options={filter.options}
                        selectedOptions={selectedFilters[filter.key]}
                        onOptionChange={(value) => handleOptionChange(filter.key, value)}
                        onClearSection={() => onFilterChange(filter.key, [])}
                        isOpen={openSections[filter.key]}
                        onToggle={() => toggleSection(filter.key)}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onApply}
                    className="w-full py-2 font-bold shadow-sm"
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    );
};

export default FilterSidebar;