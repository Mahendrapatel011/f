// components/common/AmountButton.jsx
const AmountButton = ({ 
    amount, 
    isSelected, 
    onClick, 
    className = '' 
}) => {
    return (
        <button
            type="button"
            onClick={() => onClick(amount)}
            className={`
                px-4 py-2 
                text-sm font-medium 
                rounded-lg 
                border-2 
                transition-all duration-200
                ${isSelected 
                    ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white' 
                    : 'border-gray-300 text-gray-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'
                }
                ${className}
            `}
        >
            ₹{amount.toLocaleString()}
        </button>
    );
};

export default AmountButton;