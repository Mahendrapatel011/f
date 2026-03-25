import React from 'react';
import { FaWallet, FaExclamationCircle } from 'react-icons/fa';

const LedgerSummaryCard = ({ balance, isAdminMode = false }) => {
    // If balance > 0, Platform Owes Lab (Admin perspective: Payable, Lab perspective: Receivable)
    // If balance < 0, Lab Owes Platform (Admin perspective: Receivable, Lab perspective: Payable)

    const isLabOwesPlatform = balance < 0;
    const isPlatformOwesLab = balance > 0;
    const absBalance = Math.abs(balance || 0);

    let title = "Current Balance";
    let message = "All settled up. No outstanding dues.";
    let colorClass = "bg-gray-50 text-gray-800 border-gray-200";
    let iconColor = "text-gray-500";

    if (isAdminMode) {
        if (isPlatformOwesLab) {
            title = "You Owe Business";
            message = "This amount is payable to the business for online orders.";
            colorClass = "bg-orange-50 text-orange-800 border-orange-200";
            iconColor = "text-orange-500";
        } else if (isLabOwesPlatform) {
            title = "Business Owes You";
            message = "This amount is receivable from the business for COD commissions.";
            colorClass = "bg-green-50 text-green-800 border-green-200";
            iconColor = "text-green-500";
        }
    } else {
        if (isPlatformOwesLab) {
            title = "Platform Owes You";
            message = "This amount will be settled to your bank account.";
            colorClass = "bg-green-50 text-green-800 border-green-200";
            iconColor = "text-green-500";
        } else if (isLabOwesPlatform) {
            title = "You Owe Platform";
            message = "Please pay this commission balance to avoid account suspension.";
            colorClass = "bg-red-50 text-red-800 border-red-200";
            iconColor = "text-red-500";
        }
    }

    return (
        <div className={`rounded-3xl p-6 border ${colorClass} shadow-sm relative overflow-hidden`}>
            {/* Background Icon */}
            <FaWallet className={`absolute -right-6 -bottom-6 text-[120px] opacity-[0.05] ${iconColor}`} />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80 flex items-center gap-2">
                        {title}
                        {(isAdminMode && isPlatformOwesLab) || (!isAdminMode && isLabOwesPlatform) ? (
                            <FaExclamationCircle className="text-lg opacity-80" />
                        ) : null}
                    </h3>
                    <div className="text-4xl font-black mb-4 tracking-tight">
                        ₹{absBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm`}>
                    <FaWallet className={`text-xl ${iconColor}`} />
                </div>
            </div>

            <p className="text-sm font-medium opacity-90 relative z-10 mt-2">
                {message}
            </p>
        </div>
    );
};

export default LedgerSummaryCard;
