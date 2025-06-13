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
          <Button icon="CalendarPlus">
            Add Event
          </Button>
        </div>

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
      </motion.div>
    </div>
  );
};

export default Calendar;