import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from './Button';

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry = null,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
      
      <h3 className="text-lg font-heading font-medium text-surface-900 mb-2">
        Error
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" icon="RefreshCw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;