import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BookingCard from '../components/bookings/BookingCard';
import bookingService from '../services/bookingService';
import resourceService from '../services/resourceService';

const AdminBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
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
    loadResources();
    loadBookings();
    // eslint-disable-next-line
  }, [filters]);

  const loadResources = async () => {
    try {
      const data = await resourceService.getAllResources();
      setResources(data || []);
    } catch (error) {
      toast.error('Failed to load resources');
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings(filters, user);
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
          await bookingService.updateBookingStatus(booking.id, { status: 'APPROVED' }, user);
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
          await bookingService.deleteBooking(booking.id, user);
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
      await bookingService.updateBookingStatus(
        selectedBooking.id, 
        { status: 'REJECTED', reason: rejectReason }, 
        user
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

  // Helper: group resources by building
  const groupResourcesByBuilding = (resources) => {
    const grouped = { 'Main Building': [], 'New Building': [] };
    resources.forEach(r => {
      if (r.building === 'Main Building') grouped['Main Building'].push(r);
      else if (r.building === 'New Building') grouped['New Building'].push(r);
    });
    return grouped;
  };

  // Helper: check if resource is booked (approved) or pending
  const isResourceBooked = (resourceId) => {
    return bookings.some(b => Number(b.resourceId) === Number(resourceId) && b.status === 'APPROVED');
  };
  const isResourcePending = (resourceId) => {
    return bookings.some(b => Number(b.resourceId) === Number(resourceId) && b.status === 'PENDING');
  };

  const groupedResources = groupResourcesByBuilding(resources);

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="container">
            <div className="card">
              <div className="card-header">
                <h2>Admin - Booked Lecture Halls</h2>
              </div>
              <div style={{ display: 'flex', gap: '40px', marginTop: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Main Building Section - Unified Grid */}
                <div style={{ flex: 1, minWidth: 340, background: '#f8f9fa', borderRadius: '12px', boxShadow: '0 2px 8px #0001', padding: '24px', marginBottom: '32px' }}>
                  <h2 style={{ marginBottom: 18, color: '#1a237e', letterSpacing: 1 }}>Main Building</h2>
                  {groupedResources['Main Building'].length === 0 ? (
                    <div style={{ color: '#888' }}>No halls found</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '14px' }}>
                      {groupedResources['Main Building'].map(hall => {
                        let status = 'available';
                        if (isResourceBooked(hall.id)) status = 'booked';
                        else if (isResourcePending(hall.id)) status = 'pending';
                        let style = {
                          padding: '18px 0',
                          border: '2px solid #43a047',
                          borderRadius: '10px',
                          background: '#e8f5e9',
                          textAlign: 'center',
                          fontWeight: 600,
                          fontSize: 18,
                          color: '#1b5e20',
                          transition: 'box-shadow 0.2s',
                          boxShadow: '0 1px 4px #0001',
                          position: 'relative',
                        };
                        let badge = null;
                        if (status === 'pending') {
                          style = { ...style, border: '2px solid #fbc02d', background: '#fffde7', color: '#fbc02d' };
                          badge = (
                            <span style={{
                              position: 'absolute',
                              top: 6,
                              right: 10,
                              background: '#fbc02d',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              borderRadius: 6,
                              padding: '2px 10px',
                              letterSpacing: 1
                            }}>Pending</span>
                          );
                        } else if (status === 'booked') {
                          style = { ...style, border: '2px solid #d32f2f', background: '#ffebee', color: '#b71c1c' };
                          badge = (
                            <span style={{
                              position: 'absolute',
                              top: 6,
                              right: 10,
                              background: '#d32f2f',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              borderRadius: 6,
                              padding: '2px 10px',
                              letterSpacing: 1
                            }}>Booked</span>
                          );
                        }
                        return (
                          <div key={hall.id} style={style}>
                            {hall.name}
                            {badge}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {/* New Building Section - Unified Grid */}
                <div style={{ flex: 1, minWidth: 340, background: '#f8f9fa', borderRadius: '12px', boxShadow: '0 2px 8px #0001', padding: '24px', marginBottom: '32px' }}>
                  <h2 style={{ marginBottom: 18, color: '#00695c', letterSpacing: 1 }}>New Building</h2>
                  {groupedResources['New Building'].length === 0 ? (
                    <div style={{ color: '#888' }}>No halls found</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '14px' }}>
                      {groupedResources['New Building'].map(hall => {
                        let status = 'available';
                        if (isResourceBooked(hall.id)) status = 'booked';
                        else if (isResourcePending(hall.id)) status = 'pending';
                        let style = {
                          padding: '18px 0',
                          border: '2px solid #43a047',
                          borderRadius: '10px',
                          background: '#e8f5e9',
                          textAlign: 'center',
                          fontWeight: 600,
                          fontSize: 18,
                          color: '#1b5e20',
                          transition: 'box-shadow 0.2s',
                          boxShadow: '0 1px 4px #0001',
                          position: 'relative',
                        };
                        let badge = null;
                        if (status === 'pending') {
                          style = { ...style, border: '2px solid #fbc02d', background: '#fffde7', color: '#fbc02d' };
                          badge = (
                            <span style={{
                              position: 'absolute',
                              top: 6,
                              right: 10,
                              background: '#fbc02d',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              borderRadius: 6,
                              padding: '2px 10px',
                              letterSpacing: 1
                            }}>Pending</span>
                          );
                        } else if (status === 'booked') {
                          style = { ...style, border: '2px solid #d32f2f', background: '#ffebee', color: '#b71c1c' };
                          badge = (
                            <span style={{
                              position: 'absolute',
                              top: 6,
                              right: 10,
                              background: '#d32f2f',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              borderRadius: 6,
                              padding: '2px 10px',
                              letterSpacing: 1
                            }}>Booked</span>
                          );
                        }
                        return (
                          <div key={hall.id} style={style}>
                            {hall.name}
                            {badge}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {/* Bookings List */}
              <div style={{ marginTop: '40px' }}>
                <h3>All Bookings List</h3>
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
        </div>
      </div>
    </div>
  );
}

export default AdminBookings;
