// components/business/testCatalogue/Pagination.jsx
import React from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage, '...', totalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                <IoChevronBackOutline className="text-lg" />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                        page === currentPage
                            ? 'bg-[#1a237e] text-white'
                            : page === '...'
                            ? 'text-gray-400 cursor-default'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                <IoChevronForwardOutline className="text-lg" />
            </button>
        </div>
    );
};

export default Pagination;