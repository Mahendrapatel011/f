// components/business/testCatalogue/TestTable.jsx
import React from 'react';
import TestTableRow from './TestTableRow';

const TestTable = ({ tests, onToggleStatus, onEdit, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a237e]"></div>
                </div>
            </div>
        );
    }

    if (tests.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium">No tests found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-[#1a237e] font-semibold text-sm">
                                Test Name
                            </th>
                            <th className="text-left py-3 px-4 text-[#1a237e] font-semibold text-sm hidden md:table-cell">
                                Category
                            </th>
                            <th className="text-left py-3 px-4 text-[#1a237e] font-semibold text-sm hidden lg:table-cell">
                                Sub Categories
                            </th>
                            <th className="text-left py-3 px-4 text-[#1a237e] font-semibold text-sm">
                                Price
                            </th>
                            <th className="text-left py-3 px-4 text-[#1a237e] font-semibold text-sm">
                                Status
                            </th>
                            <th className="text-left py-3 px-4 text-[#1a237e] font-semibold text-sm">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map((test) => (
                            <TestTableRow
                                key={test._id}
                                test={test}
                                onToggleStatus={onToggleStatus}
                                onEdit={onEdit}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TestTable;