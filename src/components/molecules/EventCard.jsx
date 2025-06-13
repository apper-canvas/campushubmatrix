import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '../ApperIcon';

const EventCard = ({ event, className = '' }) => {
  const typeColors = {
    academic: 'bg-primary',
    career: 'bg-accent',
    ceremony: 'bg-secondary',
    registration: 'bg-info'
  };

  const typeIcons = {
    academic: 'BookOpen',
    career: 'Briefcase',
    ceremony: 'Award',
    registration: 'Calendar'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-sm border border-surface-200 p-4 ${className}`}
    >
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 rounded-lg ${typeColors[event.type]} flex items-center justify-center mr-3`}>
          <ApperIcon name={typeIcons[event.type]} className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold text-surface-900 truncate">
            {event.title}
          </h4>
          <p className="text-sm text-surface-500">
            {format(new Date(event.date), 'MMM dd, yyyy - h:mm a')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-surface-600 mb-2">
        <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
        <span className="truncate">{event.location}</span>
      </div>
      
      <p className="text-sm text-surface-600 break-words">
        {event.description}
      </p>
    </motion.div>
  );
};

export default EventCard;