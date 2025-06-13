import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import AnnouncementCard from '../molecules/AnnouncementCard';
import ApperIcon from '../ApperIcon';
import { announcementService } from '@/services';

const Communications = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    audience: 'all'
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await announcementService.getAll();
      setAnnouncements(result);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const created = await announcementService.create(newAnnouncement);
      setAnnouncements(prev => [created, ...prev]);
      setNewAnnouncement({
        title: '',
        content: '',
        priority: 'medium',
        audience: 'all'
      });
      setShowComposer(false);
      toast.success('Announcement created successfully!');
    } catch (err) {
      toast.error('Failed to create announcement');
    }
  };

  const getFilteredAnnouncements = () => {
    if (filter === 'all') return announcements;
    return announcements.filter(announcement => 
      announcement.priority === filter || announcement.audience === filter
    );
  };

  const priorityColors = {
    high: 'text-error',
    medium: 'text-warning',
    low: 'text-info'
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
        <ErrorState message={error} onRetry={loadAnnouncements} />
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
              Communications
            </h1>
            <p className="text-surface-600">
              Create and manage campus announcements
            </p>
          </div>
          <Button 
            icon="MessageSquarePlus"
            onClick={() => setShowComposer(!showComposer)}
          >
            New Announcement
          </Button>
        </div>

        {/* Announcement Composer */}
        {showComposer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">
                Create Announcement
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComposer(false)}
                icon="X"
              />
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Audience
                  </label>
                  <select
                    value={newAnnouncement.audience}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, audience: e.target.value }))}
                    className="w-full border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="all">All</option>
                    <option value="students">Students</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title..."
                  className="w-full border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter announcement content..."
                  rows={4}
                  className="w-full border border-surface-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowComposer(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" icon="Send">
                  Publish Announcement
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-surface-700 mr-2">Filter by:</span>
            
            {['all', 'high', 'medium', 'low', 'students', 'faculty', 'staff'].map(filterOption => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === filterOption
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {filterOption === 'all' ? 'All' : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 text-center">
            <div className="text-2xl font-heading font-bold text-surface-900">
              {announcements.length}
            </div>
            <div className="text-sm text-surface-600">Total Announcements</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 text-center">
            <div className="text-2xl font-heading font-bold text-error">
              {announcements.filter(a => a.priority === 'high').length}
            </div>
            <div className="text-sm text-surface-600">High Priority</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 text-center">
            <div className="text-2xl font-heading font-bold text-warning">
              {announcements.filter(a => a.priority === 'medium').length}
            </div>
            <div className="text-sm text-surface-600">Medium Priority</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 text-center">
            <div className="text-2xl font-heading font-bold text-info">
              {announcements.filter(a => a.priority === 'low').length}
            </div>
            <div className="text-sm text-surface-600">Low Priority</div>
          </div>
        </div>

        {/* Announcements List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-surface-900">
              Recent Announcements
            </h2>
            <p className="text-sm text-surface-600">
              {getFilteredAnnouncements().length} announcements
            </p>
          </div>

          {getFilteredAnnouncements().length === 0 ? (
            <EmptyState
              icon="MessageSquare"
              title="No announcements found"
              description="Create your first announcement to get started"
              actionLabel="Create Announcement"
              onAction={() => setShowComposer(true)}
            />
          ) : (
            <div className="space-y-4">
              {getFilteredAnnouncements().map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnnouncementCard announcement={announcement} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Communications;