const Input = ({
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
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
            
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`
                    w-full 
                    ${icon ? 'pl-11' : 'pl-4'} 
                    pr-4 
                    py-3 
                    border 
                    border-gray-300 
                    rounded-lg 
                    text-gray-700 
                    placeholder-gray-400
                    focus:outline-none 
                    focus:border-[#1e3a5f] 
                    focus:ring-1 
                    focus:ring-[#1e3a5f]
                    disabled:bg-gray-100 
                    disabled:cursor-not-allowed
                    transition-colors
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

export default Input;