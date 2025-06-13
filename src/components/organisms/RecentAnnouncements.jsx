import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnnouncementCard from '../molecules/AnnouncementCard';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import { announcementService } from '@/services';

const RecentAnnouncements = ({ className = '' }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await announcementService.getRecent(3);
      setAnnouncements(result);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonLoader count={3} className={className} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadAnnouncements} className={className} />;
  }

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon="MessageSquare"
        title="No announcements"
        description="Recent announcements will appear here"
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {announcements.map((announcement, index) => (
        <motion.div
          key={announcement.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AnnouncementCard announcement={announcement} />
        </motion.div>
      ))}
    </div>
  );
};

export default RecentAnnouncements;