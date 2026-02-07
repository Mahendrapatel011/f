const TextArea = ({
    name,
    placeholder,
    value,
    onChange,
    icon,
    rows = 4,
    className = '',
    required = false,
    disabled = false,
    ...props
}) => {
    return (
        <div className="relative">
            {/* Icon */}
            {icon && (
                <span className="absolute left-4 top-4 text-gray-400">
                    {icon}
                </span>
            )}
            
            <textarea
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                rows={rows}
                required={required}
                disabled={disabled}
                className={`
                    w-full 
                    ${icon ? 'pl-11' : 'pl-4'} 
                    pr-4 
                    py-3 
                    border 
                    border-gray-200 
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
                    resize-none
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

export default TextArea;