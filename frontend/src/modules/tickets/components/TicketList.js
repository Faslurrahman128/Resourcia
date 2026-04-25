import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ticketService from '../services/ticketService';

const TicketList = ({ userId, userRole, onTicketSelect }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTickets();
  }, [userId, filter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      let ticketData;
      
      if (filter === 'my-tickets') {
        ticketData = await ticketService.getTicketsByUser(userId);
      } else if (filter === 'assigned-to-me' && userRole === 'technician') {
        ticketData = await ticketService.getTicketsByTechnician(userId);
      } else if (filter === 'open') {
        ticketData = await ticketService.getTicketsByStatus('OPEN');
      } else if (filter === 'in-progress') {
        ticketData = await ticketService.getTicketsByStatus('IN_PROGRESS');
      } else {
        ticketData = await ticketService.getTicketsByUser(userId);
      }
      
      setTickets(ticketData);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'RESOLVED': return 'bg-green-50 text-green-700 border-green-200';
      case 'CLOSED': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'HIGH': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'URGENT': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <div className="text-gray-500 text-sm">Loading tickets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tickets by title or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tickets</option>
              <option value="my-tickets">My Tickets</option>
              {userRole === 'technician' && (
                <option value="assigned-to-me">Assigned to Me</option>
              )}
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
            </select>
            <button
              onClick={loadTickets}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
              onClick={() => onTicketSelect(ticket)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {ticket.title || `Ticket #${ticket.id}`}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{ticket.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status?.replace('_', ' ') || 'OPEN'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    {ticket.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border-purple-200">
                        {ticket.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-6 flex flex-col items-end gap-2">
                  <button className="text-blue-600 hover:text-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-4">
                  {ticket.location && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ticket.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                {ticket.assignedTo && (
                  <span className="text-blue-600 font-medium">Assigned to Technician</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;
