// components/account/TransactionTable.jsx
import { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaChevronDown } from 'react-icons/fa';
import SearchInput from '../common/SearchInput';
import Badge from '../common/Badge';

const TransactionTable = ({ transactions = [], onShowMore }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = transactions.filter(txn =>
        txn._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return `₹${amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full sm:w-48"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                Transaction ID
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                Transaction Type
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                Amount
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((txn) => (
                                <tr
                                    key={txn._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-700 font-medium text-xs">
                                            {txn._id}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {txn.type === 'debit' ? (
                                                <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                                    <FaArrowUp className="text-red-500 text-xs" />
                                                </span>
                                            ) : (
                                                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                    <FaArrowDown className="text-green-500 text-xs" />
                                                </span>
                                            )}
                                            <span className={`text-sm font-medium ${txn.type === 'debit' ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {txn.type === 'debit' ? 'Paid/Debit' : 'Added/Credit'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`text-sm font-bold ${txn.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                                            {txn.type === 'debit' ? '-' : '+'}{formatAmount(txn.amount)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(txn.createdAt)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Show More Button */}
            {filteredTransactions.length > 0 && onShowMore && (
                <div className="flex justify-center pt-2">
                    <button
                        onClick={onShowMore}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] 
                            transition-colors font-medium"
                    >
                        Show more
                        <FaChevronDown className="text-xs" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionTable;