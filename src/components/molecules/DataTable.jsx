import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DataTable = ({ 
  columns = [], 
  data = [], 
  onRowClick = null,
  onEdit = null,
  onView = null,
  onDelete = null,
  className = ''
}) => {
  // Add actions column if any action handlers are provided
  const hasActions = onEdit || onView || onDelete;
  const allColumns = hasActions 
    ? [...columns, { key: 'actions', header: 'Actions', width: '120px' }]
    : columns;

  const renderCell = (column, row, rowIndex) => {
    if (column.key === 'actions') {
      return (
        <div className="flex items-center space-x-2">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
              className="p-1 text-surface-400 hover:text-info transition-colors"
              title="View"
            >
              <ApperIcon name="Eye" className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              className="p-1 text-surface-400 hover:text-primary transition-colors"
              title="Edit"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row?.id || row?._id);
              }}
              className="p-1 text-surface-400 hover:text-error transition-colors"
              title="Delete"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    const value = row?.[column.key];
    
    if (column.render) {
      try {
        return column.render(value, row, rowIndex);
      } catch (error) {
        console.error(`Error rendering column ${column.key}:`, error);
        return <span className="text-error text-sm">Error</span>;
      }
    }
    
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return <span className="text-surface-400">-</span>;
    }
    
    return value;
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-surface-500">
        No data available
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-surface-200">
        <thead className="bg-surface-50">
          <tr>
            {allColumns.map((column, index) => (
              <th
                key={column.key || index}
                className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider"
                style={column.width ? { width: column.width } : {}}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-surface-200">
          {data?.map((row, rowIndex) => (
            <motion.tr
              key={row?.id || row?._id || rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="hover:bg-surface-50 cursor-pointer transition-colors duration-150"
              onClick={() => onRowClick?.(row)}
            >
              {allColumns.map((column, colIndex) => (
                <td key={`${column.key}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-surface-900">
                    {renderCell(column, row, rowIndex)}
                  </div>
                </td>
              ))}
            </motion.tr>
          )) || []}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;