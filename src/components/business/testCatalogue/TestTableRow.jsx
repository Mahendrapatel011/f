// components/business/testCatalogue/TestTableRow.jsx
import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const TestTableRow = ({ test, onToggleStatus, onEdit }) => {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            {/* Test Name */}
            <td className="py-4 px-4">
                <div>
                    <p className="font-medium text-[#1a237e] text-sm md:text-base">
                        {test.name}
                    </p>
                    {test.subtitle && (
                        <p className="text-xs text-gray-400 mt-0.5">
                            {test.subtitle}
                        </p>
                    )}
                </div>
            </td>

            {/* Category */}
            <td className="py-4 px-4 text-gray-600 text-sm hidden md:table-cell">
                {test.category?.name || test.category || 'N/A'}
            </td>
            <td className="py-4 px-4 text-gray-600 text-sm hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                    {test.subCategories?.map((sc, i) => (
                        <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                            {sc.name || sc}
                        </span>
                    )) || 'N/A'}
                </div>
            </td>

            {/* Price */}
            <td className="py-4 px-4 text-gray-800 font-medium text-sm">
                ₹{test.price}
            </td>

            {/* Status Toggle */}
            <td className="py-4 px-4">
                <ToggleSwitch
                    isActive={test.isActive}
                    onToggle={() => onToggleStatus(test._id)}
                />
            </td>

            {/* Action */}
            <td className="py-4 px-4">
                <button
                    onClick={() => onEdit(test)}
                    className="text-[#1a237e] hover:text-[#0d1453] font-medium text-sm hover:underline transition-all"
                >
                    Edit
                </button>
            </td>
        </tr>
    );
};

export default TestTableRow;