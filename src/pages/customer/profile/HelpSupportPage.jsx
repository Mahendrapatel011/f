// pages/profile/HelpSupportPage.jsx
import { useState } from 'react';
import {
    RaiseTicketCard,
    TicketTable,
    RaiseTicketModal,
    ViewTicketModal,
    DeleteConfirmModal
} from '../../../components/support';

const HelpSupportPage = () => {
    // State
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    // Mock tickets data
    const [tickets, setTickets] = useState([
        {
            id: 1,
            ticketId: 'T1234567890',
            subject: 'Payment not processed',
            category: 'Payment Issue',
            description: 'I made a payment for my booking but it shows as pending. Please help.',
            status: 'pending',
            lastUpdated: '2025-05-19',
            createdAt: '2025-05-18T10:30:00',
            attachments: [],
            response: null,
            responseDate: null
        },
        {
            id: 2,
            ticketId: 'T1234567890',
            subject: 'Booking cancellation request',
            category: 'Booking Issue',
            description: 'I want to cancel my booking due to personal reasons.',
            status: 'pending',
            lastUpdated: '2025-05-19',
            createdAt: '2025-05-17T14:20:00',
            attachments: [],
            response: null,
            responseDate: null
        },
        {
            id: 3,
            ticketId: 'T1234567890',
            subject: 'Refund not received',
            category: 'Refund Request',
            description: 'I cancelled my booking 5 days ago but haven\'t received my refund yet.',
            status: 'pending',
            lastUpdated: '2025-05-19',
            createdAt: '2025-05-16T09:15:00',
            attachments: [],
            response: null,
            responseDate: null
        },
        {
            id: 4,
            ticketId: 'T1234567890',
            subject: 'App not loading',
            category: 'Technical Problem',
            description: 'The app is showing a blank screen when I try to open it.',
            status: 'pending',
            lastUpdated: '2025-05-19',
            createdAt: '2025-05-15T16:45:00',
            attachments: [],
            response: null,
            responseDate: null
        }
    ]);

    // Handlers
    const handleRaiseTicket = () => {
        setIsRaiseModalOpen(true);
    };

    const handleSubmitTicket = async (formData) => {
        console.log('Submitting ticket:', formData);

        // Create new ticket
        const newTicket = {
            id: Date.now(),
            ticketId: `T${Date.now().toString().slice(-10)}`,
            subject: formData.subject,
            description: formData.description,
            status: 'pending',
            lastUpdated: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            attachments: formData.attachments || [],
            response: null,
            responseDate: null
        };

        setTickets(prev => [newTicket, ...prev]);
        alert('Ticket raised successfully!');
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsViewModalOpen(true);
    };

    const handleEditTicket = (ticket) => {
        console.log('Editing ticket:', ticket);
        // TODO: Open edit modal with ticket data
        setIsViewModalOpen(false);
        alert('Edit functionality coming soon!');
    };

    const handleDeleteClick = (ticketId) => {
        setTicketToDelete(ticketId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (ticketToDelete) {
            setTickets(prev => prev.filter(t => t.id !== ticketToDelete));
            setIsDeleteModalOpen(false);
            setTicketToDelete(null);
            alert('Ticket deleted successfully!');
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Raise Ticket Card */}
            <RaiseTicketCard onRaiseTicket={handleRaiseTicket} />

            {/* Tickets Table */}
            <TicketTable
                tickets={tickets}
                onViewTicket={handleViewTicket}
                onDeleteTicket={handleDeleteClick}
            />

            {/* Raise Ticket Modal */}
            <RaiseTicketModal
                isOpen={isRaiseModalOpen}
                onClose={() => setIsRaiseModalOpen(false)}
                onSubmit={handleSubmitTicket}
            />

            {/* View Ticket Modal */}
            <ViewTicketModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
                onEdit={handleEditTicket}
                onDelete={handleDeleteClick}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setTicketToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Ticket"
                message="Are you sure you want to delete this ticket? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default HelpSupportPage;
