import React, { useState } from 'react';
import toast from 'react-hot-toast';
import bookingService from '../../services/bookingService';

const BookingForm = ({ resourceId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    resourceId: resourceId || '',  // Make sure this is empty string initially
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.resourceId || formData.resourceId.trim() === '') {
      newErrors.resourceId = 'Resource ID is required';
    }
    
    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Booking date is required';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.bookingDate = 'Booking date cannot be in the past';
      }
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    } else if (formData.purpose.trim().length < 10) {
      newErrors.purpose = 'Purpose must be at least 10 characters';
    }
    
    const attendees = parseInt(formData.expectedAttendees);
    if (isNaN(attendees) || attendees < 1) {
      newErrors.expectedAttendees = 'At least 1 attendee required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    
    if (!validateForm()) {
      console.log('Validation errors:', errors);
      toast.error('Please fix the form errors');
      return;
    }
    
    setLoading(true);
    
    // Prepare data exactly as backend expects
    const requestData = {
      resourceId: formData.resourceId.trim(),
      bookingDate: formData.bookingDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose.trim(),
      expectedAttendees: parseInt(formData.expectedAttendees)
    };
    
    console.log('Sending to backend:', requestData);
    
    try {
      const response = await bookingService.createBooking(requestData);
      console.log('Response from backend:', response);
      toast.success('Booking request submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      // Show detailed error from backend
      if (error.error) {
        toast.error(error.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create booking');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Request Booking</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Resource ID *</label>
            <input
              type="text"
              name="resourceId"
              value={formData.resourceId}
              onChange={handleChange}
              placeholder="Enter resource ID (e.g., resource1, room101, lab202)"
            />
            {errors.resourceId && <small style={{color: 'red'}}>{errors.resourceId}</small>}
          </div>
          
          <div className="form-group">
            <label>Booking Date *</label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.bookingDate && <small style={{color: 'red'}}>{errors.bookingDate}</small>}
          </div>
          
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
            {errors.startTime && <small style={{color: 'red'}}>{errors.startTime}</small>}
          </div>
          
          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
            {errors.endTime && <small style={{color: 'red'}}>{errors.endTime}</small>}
          </div>
          
          <div className="form-group">
            <label>Purpose * (minimum 10 characters)</label>
            <textarea
              name="purpose"
              rows="3"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Describe the purpose of this booking..."
            />
            {errors.purpose && <small style={{color: 'red'}}>{errors.purpose}</small>}
          </div>
          
          <div className="form-group">
            <label>Expected Attendees *</label>
            <input
              type="number"
              name="expectedAttendees"
              min="1"
              value={formData.expectedAttendees}
              onChange={handleChange}
            />
            {errors.expectedAttendees && <small style={{color: 'red'}}>{errors.expectedAttendees}</small>}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
