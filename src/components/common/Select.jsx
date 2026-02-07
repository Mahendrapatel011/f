// common/Select.jsx
const Select = ({
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    icon,
    className = '',
    required = false,
    disabled = false,
    ...props
}) => {
    return (
        <div className="relative">
            {/* Icon */}
            {icon && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </span>
            )}
            
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`
                    w-full 
                    ${icon ? 'pl-11' : 'pl-4'} 
                    pr-10 
                    py-3 
                    border 
                    border-gray-300 
                    rounded-lg 
                    text-gray-700 
                    bg-white
                    focus:outline-none 
                    focus:border-[#1e3a5f] 
                    focus:ring-1 
                    focus:ring-[#1e3a5f]
                    disabled:bg-gray-100 
                    disabled:cursor-not-allowed
                    transition-colors
                    appearance-none
                    cursor-pointer
                    ${className}
                `}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            {/* Dropdown Arrow */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </span>
        </div>
    );
};

export default Select;