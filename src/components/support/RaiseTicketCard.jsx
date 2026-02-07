// components/support/RaiseTicketCard.jsx
import Button from '../common/Button';

const RaiseTicketCard = ({ onRaiseTicket }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
            gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
            
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Raise a Ticket
                </h3>
                <p className="text-sm text-gray-600">
                    Facing an issue? We're here to help.
                </p>
                <p className="text-sm text-gray-500">
                    Submit a ticket and we'll work on a resolution as quickly as possible.
                </p>
            </div>

            <Button
                variant="secondary"
                size="md"
                onClick={onRaiseTicket}
                className="whitespace-nowrap"
            >
                Raise a Ticket
            </Button>
        </div>
    );
};

export default RaiseTicketCard;