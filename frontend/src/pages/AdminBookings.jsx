import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BookingCard from '../components/bookings/BookingCard';
import bookingService from '../services/bookingService';

const AdminBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    resourceId: '',
    startDate: '',
    endDate: ''
  });
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [filters]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await bookingService.getAllBookings(token, filters);
      setBookings(data.content || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (action, booking) => {
    if (action === 'approve') {
      if (window.confirm('Approve this booking?')) {
        try {
          const token = localStorage.getItem('token');
          await bookingService.updateBookingStatus(booking.id, { status: 'APPROVED' }, token);
          toast.success('Booking approved successfully');
          loadBookings();
        } catch (error) {
          toast.error(error.message || 'Failed to approve booking');
        }
      }
    } else if (action === 'reject') {
      setSelectedBooking(booking);
      setShowRejectModal(true);
    } else if (action === 'delete') {
      if (window.confirm('Delete this booking? This action cannot be undone.')) {
        try {
          const token = localStorage.getItem('token');
          await bookingService.deleteBooking(booking.id, token);
          toast.success('Booking deleted successfully');
          loadBookings();
        } catch (error) {
          toast.error(error.message || 'Failed to delete booking');
        }
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await bookingService.updateBookingStatus(
        selectedBooking.id, 
        { status: 'REJECTED', reason: rejectReason }, 
        token
      );
      toast.success('Booking rejected successfully');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedBooking(null);
      loadBookings();
    } catch (error) {
      toast.error(error.message || 'Failed to reject booking');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      resourceId: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Admin - All Bookings</h2>
        </div>
        
        <div className="filter-bar">
          <select 
            className="filter-select"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <input
            type="date"
            className="filter-select"
            name="startDate"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          
          <input
            type="date"
            className="filter-select"
            name="endDate"
            placeholder="End Date"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
        
        {loading ? (
          <div className="spinner"></div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No bookings found
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px', color: '#666' }}>
              Total: {bookings.length} bookings
            </div>
            {bookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onAction={handleBookingAction}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Booking</h3>
              <button className="close-btn" onClick={() => setShowRejectModal(false)}>&times;</button>
            </div>
            
            <div className="form-group">
              <label>Reason for Rejection *</label>
              <textarea
                rows="4"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason why this booking is being rejected..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleReject}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
