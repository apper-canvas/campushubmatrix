import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import EventCard from '../molecules/EventCard';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import { eventService } from '@/services';

const UpcomingEvents = ({ className = '' }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eventService.getUpcoming(4);
      setEvents(result);
    } catch (err) {
      setError(err.message || 'Failed to load events');
      toast.error('Failed to load upcoming events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonLoader count={4} className={className} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadEvents} className={className} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon="Calendar"
        title="No upcoming events"
        description="Upcoming events will appear here"
        className={className}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </div>
  );
};

export default UpcomingEvents;