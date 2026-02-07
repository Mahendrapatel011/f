// common/FormField.jsx
const FormField = ({
    label,
    required = false,
    children,
    className = '',
    error = ''
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label className="text-sm text-gray-600 font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            {children}
            {error && (
                <span className="text-red-500 text-xs mt-1">{error}</span>
            )}
        </div>
    );
};

export default FormField;