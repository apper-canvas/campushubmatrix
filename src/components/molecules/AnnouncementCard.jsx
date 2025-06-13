import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '../ApperIcon';

const AnnouncementCard = ({ announcement, className = '' }) => {
  const priorityColors = {
    high: 'bg-error text-white',
    medium: 'bg-warning text-white',
    low: 'bg-info text-white'
  };

  const priorityIcons = {
    high: 'AlertTriangle',
    medium: 'Info',
    low: 'Bell'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-sm border border-surface-200 p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-heading font-semibold text-surface-900 flex-1 min-w-0">
          {announcement.title}
        </h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3 ${priorityColors[announcement.priority]}`}>
          <ApperIcon name={priorityIcons[announcement.priority]} className="w-3 h-3 mr-1" />
          {announcement.priority}
        </span>
      </div>
      
      <p className="text-surface-600 mb-4 break-words">
        {announcement.content}
      </p>
      
      <div className="flex items-center justify-between text-sm text-surface-500">
        <span className="flex items-center">
          <ApperIcon name="User" className="w-4 h-4 mr-1" />
          {announcement.author}
        </span>
        <span className="flex items-center">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          {formatDistanceToNow(new Date(announcement.timestamp), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  );
};

export default AnnouncementCard;