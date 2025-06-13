import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '../molecules/SearchBar';
import DataTable from '../molecules/DataTable';
import Button from '../atoms/Button';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import { courseService } from '@/services';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await courseService.getAll();
      setCourses(result);
      setFilteredCourses(result);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(query.toLowerCase()) ||
      course.code.toLowerCase().includes(query.toLowerCase()) ||
      course.instructor.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleRowClick = (course) => {
    toast.info(`Viewing ${course.name} details`);
  };

  const getUtilizationColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 75) return 'text-warning';
    return 'text-success';
  };

  const columns = [
    {
      key: 'code',
      header: 'Course Code',
      render: (value) => (
        <span className="font-mono font-medium text-primary">{value}</span>
      )
    },
    {
      key: 'name',
      header: 'Course Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-surface-900">{value}</div>
          <div className="text-sm text-surface-500">{row.instructor}</div>
        </div>
      )
    },
    {
      key: 'schedule',
      header: 'Schedule',
      render: (value) => (
        <div className="text-sm">
          <div>{value.days.join(', ')}</div>
          <div className="text-surface-500">{value.time}</div>
        </div>
      )
    },
    {
      key: 'room',
      header: 'Room'
    },
    {
      key: 'enrollmentCount',
      header: 'Enrollment',
      render: (value, row) => {
        const percentage = Math.round((value / row.capacity) * 100);
        return (
          <div>
            <div className="font-medium">
              {value} / {row.capacity}
            </div>
            <div className={`text-sm ${getUtilizationColor(percentage)}`}>
              {percentage}% full
            </div>
          </div>
        );
      }
    },
    {
      key: 'capacity',
      header: 'Status',
      render: (value, row) => {
        const percentage = (row.enrollmentCount / value) * 100;
        let status = 'Available';
        let colorClass = 'bg-success/10 text-success';
        
        if (percentage >= 100) {
          status = 'Full';
          colorClass = 'bg-error/10 text-error';
        } else if (percentage >= 90) {
          status = 'Nearly Full';
          colorClass = 'bg-warning/10 text-warning';
        }
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {status}
          </span>
        );
      }
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={8} type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadCourses} />
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
              Course Management
            </h1>
            <p className="text-surface-600">
              Manage courses, schedules, and enrollment
            </p>
          </div>
          <Button icon="BookPlus">
            Add Course
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <SearchBar
            placeholder="Search courses by name, code, or instructor..."
            onSearch={handleSearch}
          />
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 text-center">
            <div className="text-2xl font-heading font-bold text-primary mb-1">
              {courses.length}
            </div>
            <div className="text-sm text-surface-600">Total Courses</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 text-center">
            <div className="text-2xl font-heading font-bold text-success mb-1">
              {courses.reduce((sum, c) => sum + c.enrollmentCount, 0)}
            </div>
            <div className="text-sm text-surface-600">Total Enrollment</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 text-center">
            <div className="text-2xl font-heading font-bold text-accent mb-1">
              {Math.round((courses.reduce((sum, c) => sum + (c.enrollmentCount / c.capacity), 0) / courses.length) * 100) || 0}%
            </div>
            <div className="text-sm text-surface-600">Avg Utilization</div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-surface-600">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
          
          {filteredCourses.length === 0 ? (
            <EmptyState
              icon="BookOpen"
              title="No courses found"
              description="Try adjusting your search criteria or add a new course"
              actionLabel="Add Course"
              onAction={() => toast.info('Add course functionality would open here')}
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredCourses}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Courses;