// components/business/testCatalogue/TestCatalogueHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const TestCatalogueHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#1a237e] hover:text-[#0d1453] font-medium mb-4 transition-colors"
            >
                <IoArrowBack className="text-lg" />
                <span>Back</span>
            </button>

            {/* Title & Subtitle */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1a237e]">
                    Test Catalogue
                </h1>
                <p className="text-gray-500 text-sm md:text-base mt-1">
                    Manage your test catalog, pricing, and availability
                </p>
            </div>
        </div>
    );
};

export default TestCatalogueHeader;