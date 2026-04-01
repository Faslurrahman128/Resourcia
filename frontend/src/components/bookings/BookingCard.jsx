import React from 'react';
import { format } from 'date-fns';
import { FaCalendar, FaClock, FaUsers, FaUser, FaComment } from 'react-icons/fa';

const BookingCard = ({ booking, onAction, isAdmin = false }) => {
  const getStatusClass = () => {
    switch(booking.status) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'approved';
      case 'REJECTED': return 'rejected';
      case 'CANCELLED': return 'cancelled';
      default: return '';
    }
  };

  const getStatusBadgeClass = () => {
    switch(booking.status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  };

  const formatTime = (time) => {
    return time ? time.substring(0, 5) : '';
  };

  const canCancel = booking.status === 'APPROVED';
  const canApproveReject = booking.status === 'PENDING' && isAdmin;

  return (
    <div className={`booking-card ${getStatusClass()}`}>
      <div className="booking-header">
        <div className="booking-title">
          {booking.resourceName || `Resource #${booking.resourceId}`}
        </div>
        <div className={`booking-status ${getStatusBadgeClass()}`}>
          {booking.status}
        </div>
      </div>
      
      <div className="booking-details">
        <div className="detail-item">
          <FaCalendar className="detail-icon" />
          <span>{format(new Date(booking.bookingDate), 'PPP')}</span>
        </div>
        <div className="detail-item">
          <FaClock className="detail-icon" />
          <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
        </div>
        <div className="detail-item">
          <FaUsers className="detail-icon" />
          <span>{booking.expectedAttendees || 1} attendees</span>
        </div>
        <div className="detail-item">
          <FaUser className="detail-icon" />
          <span>{booking.userName || `User #${booking.userId}`}</span>
        </div>
      </div>
      
      <div className="detail-item" style={{ marginBottom: '12px' }}>
        <FaComment className="detail-icon" />
        <span>{booking.purpose}</span>
      </div>
      
      {booking.rejectionReason && (
        <div style={{ 
          background: '#fee2e2', 
          padding: '8px', 
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '0.85rem'
        }}>
          <strong>Rejection Reason:</strong> {booking.rejectionReason}
        </div>
      )}
      
      <div className="booking-actions">
        {canCancel && (
          <button 
            className="btn btn-warning"
            onClick={() => onAction('cancel', booking)}
          >
            Cancel Booking
          </button>
        )}
        
        {canApproveReject && (
          <>
            <button 
              className="btn btn-success"
              onClick={() => onAction('approve', booking)}
            >
              Approve
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => onAction('reject', booking)}
            >
              Reject
            </button>
          </>
        )}
        
        {isAdmin && booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
          <button 
            className="btn btn-secondary"
            onClick={() => onAction('delete', booking)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;