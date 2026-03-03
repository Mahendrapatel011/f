import React from 'react';

const OfferTabs = ({ activeTab, setActiveTab, counts }) => {
    const tabs = [
        { id: 'active', label: `Active Offer (${counts.active})` },
        { id: 'scheduled', label: `Scheduled (${counts.scheduled})` },
        { id: 'expired', label: `Expired (${counts.expired})` }
    ];

    return (
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium transition-all whitespace-nowrap relative
                        ${activeTab === tab.id
                            ? 'text-[#1a237e]'
                            : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1a237e]" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default OfferTabs;
