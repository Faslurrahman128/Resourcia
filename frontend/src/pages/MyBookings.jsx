import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BookingCard from '../components/bookings/BookingCard';
import BookingForm from '../components/bookings/BookingForm';
import bookingService from '../services/bookingService';
import resourceService from '../services/resourceService';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [mainSearch, setMainSearch] = useState('');
  const [newSearch, setNewSearch] = useState('');

  useEffect(() => {
    loadBookings();
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceService.getAllResources();
      const deduped = Array.from(
        new Map((data || []).map((resource) => [resource.name, resource])).values()
      );
      setResources(deduped);
    } catch (error) {
      toast.error('Failed to load halls');
    }
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

  // Helper: check if resource is booked for today (or selected date)
  const isResourceBooked = (resourceId) => {
    return bookings.some(b => b.resourceId === String(resourceId) && b.status === 'APPROVED');
  };

  const groupedResources = groupResourcesByBuilding(resources);
  const filteredMainHalls = groupedResources['Main Building'].filter((hall) =>
    hall.name.toLowerCase().includes(mainSearch.toLowerCase().trim())
  );
  const filteredNewHalls = groupedResources['New Building'].filter((hall) =>
    hall.name.toLowerCase().includes(newSearch.toLowerCase().trim())
  );

  // Expand/collapse state for each building
  const [expandMain, setExpandMain] = useState(false);
  const [expandNew, setExpandNew] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getUserBookings(user.id, user);
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
          await bookingService.cancelBooking(booking.id, user);
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

        {/* Unified Hall grid display with status badges */}
        <div style={{ display: 'flex', gap: '40px', marginTop: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Main Building Section - Unified Grid with Expand/Collapse */}
          <div style={{ flex: 1, minWidth: 340, background: '#f8f9fa', borderRadius: '12px', boxShadow: '0 2px 8px #0001', padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ marginBottom: 18, color: '#1a237e', letterSpacing: 1 }}>Main Building</h2>
            <input
              type="text"
              placeholder="Search Main Building halls..."
              value={mainSearch}
              onChange={(e) => setMainSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #c7d2fe',
                marginBottom: 14,
                outline: 'none'
              }}
            />
            {groupedResources['Main Building'].length === 0 ? (
              <div style={{ color: '#888' }}>No halls found</div>
            ) : filteredMainHalls.length === 0 ? (
              <div style={{ color: '#888' }}>No halls match your search</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '14px' }}>
                  {(expandMain ? filteredMainHalls : filteredMainHalls.slice(0, 8)).map(hall => {
                    let status = 'available';
                    if (bookings.some(b => b.resourceId === hall.name && b.status === 'APPROVED')) status = 'booked';
                    else if (bookings.some(b => b.resourceId === hall.name && b.status === 'PENDING')) status = 'pending';
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
                      cursor: status === 'available' ? 'pointer' : 'not-allowed',
                      opacity: status === 'available' ? 1 : 0.85
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
                      <div
                        key={hall.id}
                        style={style}
                        onClick={() => {
                          if (status === 'available') {
                            setSelectedResource(hall.name);
                            setShowForm(true);
                          }
                        }}
                        title={status === 'available' ? 'Click to book this hall' : undefined}
                      >
                        {hall.name}
                        {badge}
                      </div>
                    );
                  })}
                </div>
                {filteredMainHalls.length > 8 && (
                  <button
                    style={{ margin: '12px auto 0', display: 'block', padding: '6px 18px', borderRadius: 6, border: '1px solid #1a237e', background: '#fff', color: '#1a237e', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => setExpandMain(e => !e)}
                  >
                    {expandMain ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </>
            )}
          </div>
          {/* New Building Section - Unified Grid with Expand/Collapse */}
          <div style={{ flex: 1, minWidth: 340, background: '#f8f9fa', borderRadius: '12px', boxShadow: '0 2px 8px #0001', padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ marginBottom: 18, color: '#00695c', letterSpacing: 1 }}>New Building</h2>
            <input
              type="text"
              placeholder="Search New Building halls..."
              value={newSearch}
              onChange={(e) => setNewSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #99f6e4',
                marginBottom: 14,
                outline: 'none'
              }}
            />
            {groupedResources['New Building'].length === 0 ? (
              <div style={{ color: '#888' }}>No halls found</div>
            ) : filteredNewHalls.length === 0 ? (
              <div style={{ color: '#888' }}>No halls match your search</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '14px' }}>
                  {(expandNew ? filteredNewHalls : filteredNewHalls.slice(0, 8)).map(hall => {
                    let status = 'available';
                    if (bookings.some(b => b.resourceId === hall.name && b.status === 'APPROVED')) status = 'booked';
                    else if (bookings.some(b => b.resourceId === hall.name && b.status === 'PENDING')) status = 'pending';
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
                      cursor: status === 'available' ? 'pointer' : 'not-allowed',
                      opacity: status === 'available' ? 1 : 0.85
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
                      <div
                        key={hall.id}
                        style={style}
                        onClick={() => {
                          if (status === 'available') {
                            setSelectedResource(hall.name);
                            setShowForm(true);
                          }
                        }}
                        title={status === 'available' ? 'Click to book this hall' : undefined}
                      >
                        {hall.name}
                        {badge}
                      </div>
                    );
                  })}
                </div>
                {filteredNewHalls.length > 8 && (
                  <button
                    style={{ margin: '12px auto 0', display: 'block', padding: '6px 18px', borderRadius: 6, border: '1px solid #00695c', background: '#fff', color: '#00695c', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => setExpandNew(e => !e)}
                  >
                    {expandNew ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bookings List */}
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
          user={user}
          onSuccess={loadBookings}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MyBookings;
