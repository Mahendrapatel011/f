// src/components/common/Pagination.jsx
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className = ""
}) => {
    const generatePageNumbers = () => {
        const pages = [];
        const showEllipsisStart = currentPage > siblingCount + 2;
        const showEllipsisEnd = currentPage < totalPages - siblingCount - 1;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (showEllipsisStart) {
                pages.push('...');
            }

            // Calculate range around current page
            const start = Math.max(2, currentPage - siblingCount);
            const end = Math.min(totalPages - 1, currentPage + siblingCount);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (showEllipsisEnd) {
                pages.push('...');
            }

            // Always show last page
            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pages = generatePageNumbers();

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a5f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <FaChevronLeft className="w-3 h-3" />
                <span>Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[36px] h-9 px-3 py-1 text-sm rounded transition-colors ${
                                currentPage === page
                                    ? 'bg-[#1e3a5f] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-[#1e3a5f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <span>Next</span>
                <FaChevronRight className="w-3 h-3" />
            </button>
        </div>
    );
};

export default Pagination;