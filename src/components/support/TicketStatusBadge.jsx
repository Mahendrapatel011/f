// components/support/TicketStatusBadge.jsx
const TicketStatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            dotColor: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            label: 'Pending'
        },
        open: {
            dotColor: 'bg-blue-500',
            textColor: 'text-blue-600',
            label: 'Open'
        },
        'in-progress': {
            dotColor: 'bg-orange-500',
            textColor: 'text-orange-600',
            label: 'In Progress'
        },
        resolved: {
            dotColor: 'bg-green-500',
            textColor: 'text-green-600',
            label: 'Resolved'
        },
        closed: {
            dotColor: 'bg-gray-500',
            textColor: 'text-gray-600',
            label: 'Closed'
        }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
            <span className={`text-sm font-medium ${config.textColor}`}>
                {config.label}
            </span>
        </div>
    );
};

export default TicketStatusBadge;