// components/account/WalletCard.jsx
import { FaShieldAlt, FaWallet } from 'react-icons/fa';

const WalletCard = ({ balance = 0, currency = '₹' }) => {
    return (
        <div className="relative w-full max-w-xs overflow-hidden rounded-2xl p-5 
            bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800
            shadow-xl"
        >
            {/* Background Decorative Circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 
                bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 
                bg-white/10 rounded-full blur-2xl" />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <FaWallet className="text-white/80 text-lg" />
                    <span className="text-white/80 text-sm font-medium">
                        Wallet Balance
                    </span>
                </div>

                {/* Balance */}
                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-white">
                        {currency}{balance.toLocaleString('en-IN', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                        })}
                    </h2>
                    <p className="text-white/60 text-xs mt-1">Available Balance</p>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/20">
                    <FaShieldAlt className="text-green-400 text-sm" />
                    <span className="text-white/70 text-xs">
                        Secured by 256-bit encryption
                    </span>
                </div>
            </div>

            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="2" />
                </svg>
            </div>
        </div>
    );
};

export default WalletCard;