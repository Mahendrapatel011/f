// components/business/testCatalogue/TestSearchFilter.jsx
import React from 'react';
import { IoSearchOutline, IoChevronDownOutline } from 'react-icons/io5';

const TestSearchFilter = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    categories
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
                <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Search tests"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e] transition-all"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                {/* Category Dropdown */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 text-sm font-medium focus:outline-none focus:border-[#1a237e] cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id || cat} value={cat._id || cat}>
                                {cat.name || cat}
                            </option>
                        ))}
                    </select>
                    <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-gray-700 text-sm font-medium focus:outline-none focus:border-[#1a237e] cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default TestSearchFilter;