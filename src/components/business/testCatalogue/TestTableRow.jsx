// components/business/testCatalogue/TestTableRow.jsx
import React, { useState } from 'react';
import ToggleSwitch from './ToggleSwitch';
import ViewPrescriptionModal from './ViewPrescriptionModal';

const TestTableRow = ({ test, onToggleStatus, onEdit }) => {
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
    const isLongNote = test.subtitle?.length > 100;

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            {/* Test Name */}
            <td className="py-4 px-4 w-[45%]">
                <div>
                    <p className="font-medium text-[#1a237e] text-sm md:text-base">
                        {test.name}
                    </p>
                    {test.subtitle && (
                        <div className="mt-1 flex items-center gap-2 max-w-md">
                            <p className="text-xs text-gray-400 truncate flex-1">
                                {test.subtitle}
                            </p>
                        
                        </div>
                    )}
                </div>

                <ViewPrescriptionModal
                    isOpen={isPrescriptionModalOpen}
                    onClose={() => setIsPrescriptionModalOpen(false)}
                    text={test.subtitle}
                    title={`${test.name} - Full Prescription`}
                />
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