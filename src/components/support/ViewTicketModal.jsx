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
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Attachments
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {ticket.attachments.map((attachment, index) => {
                                    const baseUrl = 'http://localhost:5000';
                                    const fileUrl = attachment.url ? (attachment.url.startsWith('http') ? attachment.url : `${baseUrl}${attachment.url}`) : attachment.preview;
                                    const isImage = attachment.fileType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.name);

                                    return (
                                        <a
                                            key={index}
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative"
                                            title={attachment.name}
                                        >
                                            {isImage ? (
                                                <img
                                                    src={fileUrl}
                                                    alt={attachment.name}
                                                    className="w-20 h-20 object-cover rounded-xl border border-gray-200
                                                        group-hover:opacity-80 transition-all cursor-pointer shadow-sm shadow-black/5"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 flex flex-col items-center justify-center p-2 rounded-xl border border-gray-200 bg-gray-50 group-hover:bg-gray-100 transition-all">
                                                    <span className="text-[10px] font-bold text-blue-600 uppercase mb-1">
                                                        {attachment.name?.split('.').pop() || 'File'}
                                                    </span>
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="浸 -9l-7 7m0 0l7 7m-7-7h18" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                        </a>
                                    );
                                })}
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