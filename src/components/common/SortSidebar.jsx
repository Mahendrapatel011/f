// src/components/common/SortSidebar.jsx
import { useState } from 'react';
import { FaSortAmountDown, FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { HiOutlineX } from 'react-icons/hi';
import { Button } from './index';

const SortSection = ({ title, options, selectedOption, onOptionChange, onClear, isOpen, onToggle }) => {
    const selectedLabel = options?.find(opt => opt.value === selectedOption)?.label;

    return (
        <div className="border-b border-gray-100 last:border-0 py-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-gray-800 font-bold text-sm tracking-tight">{title}</span>
                    {selectedOption && selectedOption !== '' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="text-[#1e3a5f] text-xs hover:underline font-semibold"
                        >
                            Clear
                        </button>
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
                    {/* Selected Chip for Sort (Single Select) */}
                    {selectedOption && selectedOption !== '' && (
                        <div className="flex flex-wrap gap-1.5">
                            <div className="flex items-center gap-1 bg-[#eef2f6] text-[#1e3a5f] px-2 py-1 rounded-md text-[11px] font-bold">
                                {selectedLabel}
                                <button onClick={onClear} className="hover:text-red-500">
                                    <FaTimes size={10} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="radio"
                                    name={title}
                                    checked={selectedOption === option.value}
                                    onChange={() => onOptionChange(option.value)}
                                    className="peer appearance-none w-3.5 h-3.5 border border-gray-300 rounded-full checked:border-[#1e3a5f] checked:border-4 focus:ring-0 focus:ring-offset-0 transition-all"
                                />
                                <span className={`text-xs transition-colors ${selectedOption === option.value ? 'text-[#1e3a5f] font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
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

const SortSidebar = ({ sortOptions, selectedSort, onSortChange, onApply }) => {
    const [openSections, setOpenSections] = useState({
        sort: true,
        certification: true
    });

    const activeCount = Object.values(selectedSort).filter(v => v !== '' && v !== undefined).length;

    const toggleSection = (sectionKey) => {
        setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
    };

    const handleClearAll = () => {
        Object.keys(selectedSort).forEach(key => onSortChange(key, ''));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <FaSortAmountDown className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    <h3 className="font-bold text-gray-800 text-base">Sort & Filter</h3>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">
                        {activeCount} active options
                    </span>
                    {activeCount > 0 && (
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
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {sortOptions.map((sort) => (
                    <SortSection
                        key={sort.key}
                        title={sort.title}
                        options={sort.options}
                        selectedOption={selectedSort[sort.key]}
                        onOptionChange={(value) => onSortChange(sort.key, value)}
                        onClear={() => onSortChange(sort.key, '')}
                        isOpen={openSections[sort.key]}
                        onToggle={() => toggleSection(sort.key)}
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
                    Apply Changes
                </Button>
            </div>
        </div>
    );
};

export default SortSidebar;