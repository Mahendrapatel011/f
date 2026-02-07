// components/support/ViewTicketModal.jsx
import { FaTimes } from 'react-icons/fa';
import Button from '../common/Button';

const ViewTicketModal = ({ isOpen, onClose, ticket, onEdit, onDelete }) => {
    if (!isOpen || !ticket) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                w-full max-w-md bg-white rounded-2xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">{ticket.ticketId}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FaTimes className="text-gray-400 text-lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {/* Subject */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Subject
                        </label>
                        <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg 
                            text-sm text-gray-700 bg-gray-50">
                            {ticket.subject}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                            Description
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-200 rounded-lg 
                            text-sm text-gray-700 bg-gray-50 min-h-[100px]">
                            {ticket.description}
                        </div>
                    </div>

                    {/* Attachment */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Attachment
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ticket.attachments.map((attachment, index) => (
                                    <a
                                        key={index}
                                        href={attachment.url || attachment.preview}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={attachment.url || attachment.preview}
                                            alt={attachment.name || `Attachment ${index + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200
                                                hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={() => onEdit?.(ticket)}
                            className="flex-1 !shadow-none"
                        >
                            Edit
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={onClose}
                            className="flex-1 !border-gray-300 !text-gray-600 hover:!bg-gray-50"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewTicketModal;