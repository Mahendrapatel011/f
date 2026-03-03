// components/cart/DeliveryAddress.jsx
import Button from '../common/Button';

const DeliveryAddress = ({
    address,
    onAddAddress,
    onChangeAddress,
    loading = false
}) => {
    const hasAddress = address && address.name;

    if (loading) {
        return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between 
                gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-pulse">
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between 
            gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex-1">
                <span className="text-gray-600">Deliver to : </span>
                {hasAddress ? (
                    <span className="font-semibold text-gray-900">
                        {address.name}
                        <p className="text-sm text-gray-500 font-normal mt-1">
                            {address.address}, {address.city}, {address.state}, {address.pincode}
                        </p>
                    </span>
                ) : (
                    <span className="text-gray-400">No address added</span>
                )}
            </div>

            <Button
                variant="secondary"
                size="sm"
                onClick={hasAddress ? onChangeAddress : onAddAddress}
                className="whitespace-nowrap"
            >
                {hasAddress ? 'Change Address' : 'Add Address'}
            </Button>
        </div>
    );
};

export default DeliveryAddress;