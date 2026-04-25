import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ticketService from '../services/ticketService';

const TicketDetail = ({ ticket, userId, userRole, onBack, onUpdate }) => {
  const [ticketData, setTicketData] = useState(ticket);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    technicianId: '',
    technicianName: ''
  });

  useEffect(() => {
    loadTicketDetails();
  }, [ticket.id]);

  const loadTicketDetails = async () => {
    try {
      setLoading(true);
      const [ticketDetail] = await Promise.all([
        ticketService.getTicket(ticket.id)
      ]);
      
      setTicketData(ticketDetail);
      setComments(ticketDetail.comments || []);
      setAttachments(ticketDetail.attachments || []);
      setAssignment(ticketDetail.assignment || null);
    } catch (error) {
      console.error('Error loading ticket details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await ticketService.updateTicket(ticket.id, {
        status: newStatus
      });
      
      const updatedTicket = await ticketService.getTicket(ticket.id);
      setTicketData(updatedTicket);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const comment = await ticketService.addComment(ticket.id, {
        comment: newComment,
        userId: userId
      });
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAssignTechnician = async (e) => {
    e.preventDefault();
    if (!assignmentData.technicianId) return;

    try {
      setLoading(true);
      await ticketService.assignTechnician(ticket.id, {
        technicianId: assignmentData.technicianId,
        technicianName: assignmentData.technicianName,
        assignedBy: userId
      });
      
      loadTicketDetails();
      setShowAssignmentForm(false);
      setAssignmentData({ technicianId: '', technicianName: '' });
    } catch (error) {
      console.error('Error assigning technician:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = async (status, workNotes, timeSpent) => {
    try {
      setLoading(true);
      await ticketService.updateAssignment(ticket.id, status, workNotes, timeSpent, userId);
      loadTicketDetails();
    } catch (error) {
      console.error('Error updating assignment:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading && !ticketData.id) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <div className="text-gray-500 text-sm">Loading ticket details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tickets
          </button>
          
          <div className="flex gap-3">
            {userRole === 'admin' && ticketData.status === 'OPEN' && (
              <button
                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Assign Technician
              </button>
            )}
            
            {ticketData.status === 'OPEN' && (
              <button
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Start Progress
              </button>
            )}
            
            {ticketData.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleStatusUpdate('RESOLVED')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Mark Resolved
              </button>
            )}
            
            {ticketData.status === 'RESOLVED' && (
              <button
                onClick={() => handleStatusUpdate('CLOSED')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close Ticket
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Ticket #{ticketData.id}</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ticketData.title}</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{ticketData.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(ticketData.status)}`}>
                {ticketData.status?.replace('_', ' ') || 'OPEN'}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getPriorityColor(ticketData.priority)}`}>
                {ticketData.priority}
              </span>
              {ticketData.category && (
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-50 text-purple-600 border-purple-200">
                  {ticketData.category.replace('_', ' ')}
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {ticketData.contactDetails && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">Contact: {ticketData.contactDetails}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">
                    Created: {format(new Date(ticketData.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                {ticketData.userId && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-600">User ID: {ticketData.userId}</span>
                  </div>
                )}
                {ticketData.resourceId && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-gray-600">Resource ID: {ticketData.resourceId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Assignment Info */}
            {assignment ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Technician Assignment
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-blue-700">Technician ID: {assignment.technicianId}</p>
                  <p className="text-blue-700">Assigned: {format(new Date(assignment.assignedAt), 'MMM dd, yyyy')}</p>
                  {assignment.resolutionNotes && (
                    <p className="text-blue-700 mt-3">Notes: {assignment.resolutionNotes}</p>
                  )}
                </div>
              </div>
            ) : (
              showAssignmentForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Assign Technician</h3>
                  <form onSubmit={handleAssignTechnician} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Technician ID *</label>
                      <input
                        type="number"
                        placeholder="Enter technician ID"
                        value={assignmentData.technicianId}
                        onChange={(e) => setAssignmentData(prev => ({ ...prev, technicianId: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Assign
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAssignmentForm(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )
            )}

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attachments ({attachments.length})
                </h3>
                <div className="space-y-3">
                  {attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-gray-700 text-sm">{attachment.imageUrl}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">Comments ({comments.length})</h2>
        </div>
        
        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {commentLoading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-500 text-sm">Be the first to comment on this ticket</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">User {comment.userId}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                  
                  {comment.canEdit && (
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button className="text-xs text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
