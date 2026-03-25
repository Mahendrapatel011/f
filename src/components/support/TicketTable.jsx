// components/support/TicketTable.jsx
import { FaCircle, FaTrash } from 'react-icons/fa';
import Button from '../common/Button';
import TicketStatusBadge from './TicketStatusBadge';

const TicketTable = ({ tickets = [], onViewTicket, onDeleteTicket }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleDelete = (e, ticketId) => {
        e.stopPropagation();
        onDeleteTicket?.(ticketId);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">My Tickets</h3>

            {tickets.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                    Ticket ID
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                    Last Updated
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr
                                    key={ticket._id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Ticket ID */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <FaCircle className="text-[#E11D48] text-[8px]" />
                                            <span className="text-sm text-gray-700 font-medium">
                                                {ticket.ticketId}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Last Updated */}
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600">
                                            {formatDate(ticket.lastUpdated)}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-4">
                                        <TicketStatusBadge status={ticket.status} />
                                    </td>

                                    {/* Action */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => onViewTicket(ticket)}
                                                className="!py-1.5 !px-4 !text-sm"
                                            >
                                                View
                                            </Button>
                                            <button
                                                onClick={(e) => handleDelete(e, ticket._id)}
                                                className="p-2 text-[#E11D48] hover:bg-red-50 rounded-lg 
                                                    transition-colors"
                                                title="Delete ticket"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No tickets found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Raise a ticket if you need any help
                    </p>
                </div>
            )}
        </div>
    );
};

export default TicketTable;
