// src/components/common/SortSidebar.jsx
import { useState } from 'react';
import { FaPlus, FaMinus, FaSortAmountDown } from 'react-icons/fa';
import { Button } from './index';

const SortSection = ({ title, options, selectedOption, onOptionChange, isOpen, onToggle }) => {
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
                                    type="radio"
                                    name={title}
                                    checked={selectedOption === option.value}
                                    onChange={() => onOptionChange(option.value)}
                                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-[#1e3a5f] checked:border-4 focus:ring-0 focus:ring-offset-0 transition-all"
                                />
                            </div>
                            <span className="text-sm text-gray-600 group-hover/item:text-gray-900 transition-colors">{option.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const SortSidebar = ({ sortOptions, selectedSort, onSortChange, onApply }) => {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (sectionKey) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 p-5 border-b border-gray-100 bg-white z-10">
                <FaSortAmountDown className="w-4 h-4 text-[#1e3a5f]" />
                <h3 className="font-bold text-gray-800 text-lg">Sort</h3>
            </div>

            {/* Scrollable Sort Sections */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {sortOptions.map((sort) => (
                    <SortSection
                        key={sort.key}
                        title={sort.title}
                        options={sort.options}
                        selectedOption={selectedSort[sort.key]}
                        onOptionChange={(value) => onSortChange(sort.key, value)}
                        isOpen={openSections[sort.key]}
                        onToggle={() => toggleSection(sort.key)}
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

export default SortSidebar;