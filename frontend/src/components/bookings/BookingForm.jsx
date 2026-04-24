import React, { useState } from 'react';
import toast from 'react-hot-toast';
import bookingService from '../../services/bookingService';

const BookingForm = ({ resourceId, user, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    resourceId: resourceId || '',
    bookingDate: '',
    startHour: '',
    startMinute: '00',
    startPeriod: '',
    endHour: '',
    endMinute: '00',
    endPeriod: '',
    purpose: '',
    expectedAttendees: 1
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.resourceId) {
      newErrors.resourceId = 'Resource ID is required';
    } else {
      const hallCode = formData.resourceId.trim().toUpperCase();
      const hallPattern = /^(A|B|F|G)\d{3,4}$/;
      if (!hallPattern.test(hallCode)) {
        newErrors.resourceId = 'Invalid Resource ID. Example: A303, F1305';
      }
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
    
    if (!formData.startHour || !formData.startMinute || !formData.startPeriod) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.endHour || !formData.endMinute || !formData.endPeriod) {
      newErrors.endTime = 'End time is required';
    }
    if (formData.startHour && formData.startMinute && formData.startPeriod && formData.endHour && formData.endMinute && formData.endPeriod) {
      // Convert to 24-hour for comparison
      let sHour = parseInt(formData.startHour, 10);
      let eHour = parseInt(formData.endHour, 10);
      if (formData.startPeriod === 'PM' && sHour !== 12) sHour += 12;
      if (formData.startPeriod === 'AM' && sHour === 12) sHour = 0;
      if (formData.endPeriod === 'PM' && eHour !== 12) eHour += 12;
      if (formData.endPeriod === 'AM' && eHour === 12) eHour = 0;
      const sMin = parseInt(formData.startMinute, 10);
      const eMin = parseInt(formData.endMinute, 10);
      const start = sHour * 60 + sMin;
      const end = eHour * 60 + eMin;
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      } else {
        const duration = end - start;
        if (duration > 180) {
          newErrors.endTime = 'Booking cannot exceed 3 hours';
        }
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
    // Convert to 24-hour format for backend
    function to24Hour(hour, minute, period) {
      let h = parseInt(hour, 10);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return `${h.toString().padStart(2, '0')}:${minute}`;
    }

    const requestData = {
      resourceId: formData.resourceId.trim().toUpperCase(),
      bookingDate: formData.bookingDate,
      startTime: (formData.startHour && formData.startMinute && formData.startPeriod)
        ? to24Hour(formData.startHour, formData.startMinute, formData.startPeriod)
        : '',
      endTime: (formData.endHour && formData.endMinute && formData.endPeriod)
        ? to24Hour(formData.endHour, formData.endMinute, formData.endPeriod)
        : '',
      purpose: formData.purpose.trim(),
      expectedAttendees: parseInt(formData.expectedAttendees)
    };
    
    console.log('Sending to backend:', requestData);
    
    try {
      const response = await bookingService.createBooking(requestData, user);
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
              readOnly={Boolean(resourceId)}
              style={{
                background: resourceId ? '#eee' : '#fff',
                color: '#333',
                cursor: resourceId ? 'not-allowed' : 'text'
              }}
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
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={String(i+1)}>{i+1}</option>
                ))}
              </select>
              <span>:</span>
              <select
                name="startMinute"
                value={formData.startMinute}
                onChange={handleChange}
                style={{ width: 50 }}
              >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
              <select
                name="startPeriod"
                value={formData.startPeriod}
                onChange={handleChange}
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            {errors.startTime && <small style={{color: 'red'}}>{errors.startTime}</small>}
          </div>
          
          <div className="form-group">
            <label>End Time *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                name="endHour"
                value={formData.endHour}
                onChange={handleChange}
              >
                <option value="">Hour</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={String(i+1)}>{i+1}</option>
                ))}
              </select>
              <span>:</span>
              <select
                name="endMinute"
                value={formData.endMinute}
                onChange={handleChange}
                style={{ width: 50 }}
              >
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </select>
              <select
                name="endPeriod"
                value={formData.endPeriod}
                onChange={handleChange}
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
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
