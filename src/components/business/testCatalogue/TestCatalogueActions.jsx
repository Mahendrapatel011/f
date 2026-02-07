// components/business/testCatalogue/TestCatalogueActions.jsx
import React from 'react';
import { IoCloudUploadOutline, IoAddCircleOutline } from 'react-icons/io5';
import { HiOutlinePencilSquare } from 'react-icons/hi2';

const TestCatalogueActions = ({ 
    onUploadRateList, 
    onAddTestManually, 
    onBulkEdit 
}) => {
    return (
        <div className="flex flex-wrap gap-3 mb-6">
            {/* Upload Rate List Button */}
            <button
                onClick={onUploadRateList}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#1a237e] text-[#1a237e] rounded-full font-medium hover:bg-[#1a237e] hover:text-white transition-all duration-300"
            >
                <IoCloudUploadOutline className="text-lg" />
                <span className="text-sm">Upload Rate List</span>
            </button>

            {/* Add Test Manually Button */}
            <button
                onClick={onAddTestManually}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#1a237e] text-[#1a237e] rounded-full font-medium hover:bg-[#1a237e] hover:text-white transition-all duration-300"
            >
                <IoAddCircleOutline className="text-lg" />
                <span className="text-sm">Add Test Manually</span>
            </button>

            {/* Bulk Edit Button */}
            <button
                onClick={onBulkEdit}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1a237e] text-white rounded-full font-medium hover:bg-[#0d1453] transition-all duration-300"
            >
                <HiOutlinePencilSquare className="text-lg" />
                <span className="text-sm">Bulk Edit</span>
            </button>
        </div>
    );
};

export default TestCatalogueActions;