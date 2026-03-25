// components/business/dashboard/NotificationsPanel.jsx
import React from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationsPanel = ({ notifications, onMarkAllRead }) => {
    const hasRealNotifications = notifications.length > 0 && !notifications.some(n => n.id === 'no-new');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Notifications / Alerts Panel
                </h2>
                {hasRealNotifications && (
                    <button
                        onClick={onMarkAllRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="space-y-4 flex-1">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} {...notification} />
                ))}
            </div>

            {/* View More */}
            {hasRealNotifications && (
                <div className="mt-4 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View more
                    </button>
                </div>
            )}
        </div>
    );
};

const NotificationItem = ({ message, highlight, details, time, type, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${type === 'booking' ? 'bg-orange-100' :
                    type === 'cancel' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                <FaBell className={`text-sm ${type === 'booking' ? 'text-orange-500' :
                        type === 'cancel' ? 'text-red-500' : 'text-gray-500'
                    }`} />
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-700">
                    {message}{' '}
                    <span className="font-semibold text-gray-900">{highlight}</span>{' '}
                    {details}
                </p>
                <p className="text-xs text-gray-400 mt-1">{time}</p>
            </div>
        </div>
    );
};

export default NotificationsPanel;