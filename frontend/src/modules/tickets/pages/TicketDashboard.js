import React, { useState } from 'react';
import TicketList from '../components/TicketList';
import TicketForm from '../components/TicketForm';
import TicketDetail from '../components/TicketDetail';

const TicketDashboard = ({ userId, userRole }) => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setCurrentView('list');
    setRefreshKey(prev => prev + 1);
  };

  const handleCreateTicket = () => {
    setSelectedTicket(null);
    setCurrentView('form');
  };

  const handleSaveTicket = () => {
    setSelectedTicket(null);
    setCurrentView('list');
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setSelectedTicket(null);
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
                    <p className="text-gray-600 mt-1">
                      {userRole === 'technician' ? 'Manage and resolve incident tickets' : 'Create and track your incident tickets'}
                    </p>
                  </div>
                </div>
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="hover:text-gray-700 cursor-pointer">Dashboard</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-gray-900 font-medium capitalize">
                    {currentView === 'list' && 'All Tickets'}
                    {currentView === 'form' && (selectedTicket ? 'Edit Ticket' : 'Create Ticket')}
                    {currentView === 'detail' && 'Ticket Details'}
                  </span>
                </nav>
              </div>
              
              {currentView === 'list' && (
                <button
                  onClick={handleCreateTicket}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Ticket
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div key={refreshKey} style={{
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {currentView === 'list' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <TicketList
                userId={userId}
                userRole={userRole}
                onTicketSelect={handleTicketSelect}
              />
            </div>
          )}
          
          {currentView === 'form' && (
            <TicketForm
              ticket={selectedTicket}
              onSave={handleSaveTicket}
              onCancel={handleCancelForm}
              userId={userId}
            />
          )}
          
          {currentView === 'detail' && (
            <TicketDetail
              ticket={selectedTicket}
              userId={userId}
              userRole={userRole}
              onBack={handleBackToList}
              onUpdate={handleBackToList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDashboard;
