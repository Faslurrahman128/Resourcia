import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BookingCard from '../components/bookings/BookingCard';
import BookingForm from '../components/bookings/BookingForm';
import bookingService from '../services/bookingService';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await bookingService.getUserBookings(user.id, token);
      setBookings(data.content || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (action, booking) => {
    if (action === 'cancel') {
      if (window.confirm('Are you sure you want to cancel this booking?')) {
        try {
          const token = localStorage.getItem('token');
          await bookingService.cancelBooking(booking.id, token);
          toast.success('Booking cancelled successfully');
          loadBookings();
        } catch (error) {
          toast.error(error.message || 'Failed to cancel booking');
        }
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>My Bookings</h2>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSelectedResource(null);
                setShowForm(true);
              }}
            >
              + New Booking
            </button>
          </div>
        </div>
        
        <div className="filter-bar">
          <select 
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        
        {loading ? (
          <div className="spinner"></div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No bookings found</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowForm(true)}
              style={{ marginTop: '16px' }}
            >
              Create your first booking
            </button>
          </div>
        ) : (
          <div>
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onAction={handleBookingAction}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
      
      {showForm && (
        <BookingForm
          resourceId={selectedResource}
          onSuccess={loadBookings}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MyBookings;
