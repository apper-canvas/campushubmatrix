import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  change = null, 
  trend = null,
  icon = null,
  color = 'primary',
  className = '' 
}) => {
  const colorClasses = {
    primary: 'from-primary to-primary/80',
    secondary: 'from-secondary to-secondary/80',
    accent: 'from-accent to-accent/80',
    success: 'from-success to-success/80',
    warning: 'from-warning to-warning/80',
    info: 'from-info to-info/80'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-surface-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg shadow-sm border border-surface-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <p className="text-2xl font-heading font-bold text-surface-900">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              {trend && (
                <ApperIcon 
                  name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                  className={`w-4 h-4 mr-1 ${trendColors[trend]}`} 
                />
              )}
              <span className={`text-sm font-medium ${trendColors[trend] || 'text-surface-500'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;