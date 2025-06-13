import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import Button from '../atoms/Button';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import EventCard from '../molecules/EventCard';
import ApperIcon from '../ApperIcon';
import { eventService } from '@/services';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eventService.getAll();
      setEvents(result);
    } catch (err) {
      setError(err.message || 'Failed to load events');
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const getSelectedDateEvents = () => {
    return getEventsForDate(selectedDate);
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-surface-600 bg-surface-50">
            {day}
          </div>
        ))}
        
        {/* Days */}
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          
          return (
            <motion.button
              key={day.getTime()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => setSelectedDate(day)}
              className={`
                relative p-3 min-h-[80px] border border-surface-200 hover:bg-surface-50 transition-colors
                ${isSelected ? 'bg-primary/10 border-primary' : 'bg-white'}
                ${isCurrentDay ? 'ring-2 ring-accent' : ''}
              `}
            >
              <div className={`
                text-sm font-medium mb-1
                ${isSelected ? 'text-primary' : isCurrentDay ? 'text-accent' : 'text-surface-900'}
              `}>
                {format(day, 'd')}
              </div>
              
              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className="text-xs px-1 py-0.5 bg-primary text-white rounded truncate"
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-surface-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadEvents} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">
              Academic Calendar
            </h1>
            <p className="text-surface-600">
              Manage events, deadlines, and important dates
            </p>
          </div>
<Button 
            icon="CalendarPlus"
            onClick={() => setShowAddModal(true)}
          >
            Add Event
          </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-surface-200">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-heading font-semibold text-surface-900">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    icon="ChevronLeft"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    icon="ChevronRight"
                  />
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {renderCalendarGrid()}
              </div>
            </div>
          </div>

          {/* Selected Date Events */}
          <div className="min-w-0">
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-surface-900">
                  {format(selectedDate, 'MMM dd, yyyy')}
                </h3>
              </div>
              
              <div className="space-y-3">
                {getSelectedDateEvents().length === 0 ? (
                  <EmptyState
                    icon="Calendar"
                    title="No events"
                    description="No events scheduled for this date"
                    className="py-8"
                  />
                ) : (
                  getSelectedDateEvents().map(event => (
                    <EventCard key={event.id} event={event} className="p-3" />
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <h3 className="font-heading font-semibold text-surface-900 mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-50">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-surface-500">
                        {format(new Date(event.date), 'MMM dd, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
</div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <AddEventModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={(newEvent) => {
              setEvents(prev => [...prev, newEvent]);
              setShowAddModal(false);
              toast.success('Event created successfully!');
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

// Add Event Modal Component
const AddEventModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'academic'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const eventData = {
        ...formData,
        date: `${formData.date}T${formData.time}:00`,
        status: 'scheduled'
      };
      
      const newEvent = await eventService.create(eventData);
      onSuccess(newEvent);
    } catch (error) {
      toast.error('Failed to create event');
      console.error('Event creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              Add New Event
            </h2>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.title ? 'border-error' : ''
                }`}
                placeholder="Enter event title"
              />
              {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.date ? 'border-error' : ''
                  }`}
                />
                {errors.date && <p className="text-error text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.time ? 'border-error' : ''
                  }`}
                />
                {errors.time && <p className="text-error text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.location ? 'border-error' : ''
                }`}
                placeholder="Enter event location"
              />
              {errors.location && <p className="text-error text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="academic">Academic</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                icon="CalendarPlus"
              >
                Create Event
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
};

export default Calendar;