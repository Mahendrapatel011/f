import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaCheckCircle } from 'react-icons/fa';

const LedgerTable = ({ transactions = [] }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return `₹${Math.abs(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <p className="text-gray-500 font-medium tracking-wide">No transactions found</p>
                <p className="text-xs text-gray-400 mt-1">Transactions will appear here once orders are processed.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                            <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Balance After</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((txn) => (
                            <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6">
                                    <span className="text-sm font-medium text-gray-600">
                                        {formatDate(txn.createdAt)}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {txn.type === 'credit' ? (
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                    <FaArrowDown className="text-green-600 text-[10px]" />
                                                </div>
                                            ) : txn.type === 'debit' ? (
                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                    <FaArrowUp className="text-red-600 text-[10px]" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <FaCheckCircle className="text-blue-600 text-xs" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{txn.description}</p>
                                            <p className="text-[11px] text-gray-400 font-medium uppercase mt-0.5">
                                                {txn.type === 'credit' ? 'Platform owes Lab' : txn.type === 'debit' ? 'Lab owes Platform' : 'Settlement'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <span className={`text-sm font-bold ${txn.type === 'credit' ? 'text-green-600' : txn.type === 'debit' ? 'text-red-500' : 'text-blue-600'
                                        }`}>
                                        {txn.type === 'credit' ? '+' : txn.type === 'debit' ? '-' : ''}
                                        {formatAmount(txn.amount)}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <span className={`text-sm font-bold ${txn.balanceAfter > 0 ? 'text-green-600' : txn.balanceAfter < 0 ? 'text-red-500' : 'text-gray-800'
                                        }`}>
                                        {formatAmount(txn.balanceAfter)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LedgerTable;
