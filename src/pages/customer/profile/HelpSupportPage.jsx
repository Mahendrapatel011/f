// pages/profile/HelpSupportPage.jsx
import { useState, useEffect } from 'react';
import {
    RaiseTicketCard,
    TicketTable,
    RaiseTicketModal,
    ViewTicketModal,
    DeleteConfirmModal,
    EditTicketModal
} from '../../../components/support';
import ticketService from '../../../services/ticketService';
import toast from 'react-hot-toast';

const HelpSupportPage = () => {
    // State
    const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load tickets on mount
    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await ticketService.getMyTickets();
            if (res.success) {
                setTickets(res.data);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleRaiseTicket = () => {
        setIsRaiseModalOpen(true);
    };

    const handleSubmitTicket = async (formData) => {
        try {
            const res = await ticketService.createTicket({
                subject: formData.subject,
                description: formData.description,
                priority: 'Medium',
                attachments: formData.attachments
            });

            if (res.success) {
                toast.success('Ticket raised successfully!');
                setIsRaiseModalOpen(false);
                fetchTickets(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to raise ticket');
        }
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setIsViewModalOpen(true);
    };

    const handleEditTicket = (ticket) => {
        if (ticket.status !== 'Pending') {
            toast.error('Only pending tickets can be edited');
            return;
        }
        setSelectedTicket(ticket);
        setIsViewModalOpen(false);
        setIsEditModalOpen(true);
    };

    const handleUpdateTicket = async (ticketId, ticketData) => {
        try {
            const res = await ticketService.updateTicket(ticketId, ticketData);
            if (res.success) {
                toast.success('Ticket updated successfully!');
                setIsEditModalOpen(false);
                fetchTickets(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update ticket');
        }
    };

    const handleDeleteClick = (ticketId) => {
        // Find if ticket is deletable (must be pending)
        const ticket = tickets.find(t => t._id === ticketId || t.id === ticketId);
        if (ticket && ticket.status !== 'Pending') {
            toast.error('Only pending tickets can be deleted');
            return;
        }
        
        setTicketToDelete(ticketId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (ticketToDelete) {
            try {
                const res = await ticketService.deleteTicket(ticketToDelete);
                if (res.success) {
                    toast.success('Ticket deleted successfully!');
                    setIsDeleteModalOpen(false);
                    setTicketToDelete(null);
                    fetchTickets(); // Refresh list
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete ticket');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c335a]"></div>
            </div>
        );
    }

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
                onDelete={() => handleDeleteClick(selectedTicket._id)}
            />

            {/* Edit Ticket Modal */}
            <EditTicketModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
                onUpdate={handleUpdateTicket}
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

