import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import DataTable from '@/components/molecules/DataTable';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { courseService } from '@/services';
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
      key: 'schedule_days',
      header: 'Schedule',
      render: (value, row) => (
        <div className="text-sm">
          <div>{value ? value.split(',').join(', ') : 'Not set'}</div>
          <div className="text-surface-500">{row.schedule_time || 'Time not set'}</div>
        </div>
      )
    },
    {
      key: 'room',
      header: 'Room'
    },
    {
{
      key: 'enrollment_count',
      header: 'Enrollment',
      render: (value, row) => {
        const percentage = Math.round(((value || 0) / (row.capacity || 1)) * 100);
        return (
          <div>
            <div className="font-medium">
              {value || 0} / {row.capacity || 0}
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
{
      key: 'capacity',
      header: 'Status',
      render: (value, row) => {
        const percentage = ((row.enrollment_count || 0) / (value || 1)) * 100;
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
<Button 
            icon="BookPlus"
            onClick={() => setShowAddModal(true)}
          >
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
<div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 text-center">
            <div className="text-2xl font-heading font-bold text-success mb-1">
              {courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0)}
            </div>
            <div className="text-sm text-surface-600">Total Enrollment</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 text-center">
<div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 text-center">
            <div className="text-2xl font-heading font-bold text-accent mb-1">
              {Math.round((courses.reduce((sum, c) => sum + ((c.enrollment_count || 0) / (c.capacity || 1)), 0) / courses.length) * 100) || 0}%
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
)}
        </div>
        {/* Add Course Modal */}
        {showAddModal && (
          <AddCourseModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={(newCourse) => {
              setCourses(prev => [...prev, newCourse]);
              setFilteredCourses(prev => [...prev, newCourse]);
              setShowAddModal(false);
              toast.success('Course created successfully!');
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

// Add Course Modal Component
const AddCourseModal = ({ isOpen, onClose, onSuccess }) => {
const [formData, setFormData] = useState({
    name: '',
    code: '',
    instructor: '',
    description: '',
    capacity: '',
    room: '',
    schedule_days: [],
    schedule_time: ''
  });
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule_days: prev.schedule_days.includes(day)
        ? prev.schedule_days.filter(d => d !== day)
        : [...prev.schedule_days, day]
    }));
  };

const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule_days: prev.schedule_days.includes(day)
        ? prev.schedule_days.filter(d => d !== day)
        : [...prev.schedule_days, day]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.code.trim()) newErrors.code = 'Course code is required';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Valid capacity is required';
    if (!formData.room.trim()) newErrors.room = 'Room is required';
    if (formData.schedule_days.length === 0) newErrors.days = 'At least one day must be selected';
    if (!formData.schedule_time) newErrors.time = 'Schedule time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.code.trim()) newErrors.code = 'Course code is required';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor is required';
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Valid capacity is required';
    if (!formData.room.trim()) newErrors.room = 'Room is required';
    if (formData.schedule.days.length === 0) newErrors.days = 'At least one day must be selected';
    if (!formData.schedule.time) newErrors.time = 'Schedule time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const courseData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        credits: 3,
        semester: 'Spring 2024'
      };
      
      const newCourse = await courseService.create(courseData);
      onSuccess(newCourse);
    } catch (error) {
      toast.error('Failed to create course');
      console.error('Course creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              Add New Course
            </h2>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.name ? 'border-error' : ''
                  }`}
                  placeholder="e.g., Introduction to Computer Science"
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.code ? 'border-error' : ''
                  }`}
                  placeholder="e.g., CS101"
                />
                {errors.code && <p className="text-error text-sm mt-1">{errors.code}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Instructor *
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.instructor ? 'border-error' : ''
                  }`}
                  placeholder="e.g., Dr. Jane Smith"
                />
                {errors.instructor && <p className="text-error text-sm mt-1">{errors.instructor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Room *
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.room ? 'border-error' : ''
                  }`}
                  placeholder="e.g., Room 101"
                />
                {errors.room && <p className="text-error text-sm mt-1">{errors.room}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter course description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.capacity ? 'border-error' : ''
                  }`}
                  placeholder="30"
                />
                {errors.capacity && <p className="text-error text-sm mt-1">{errors.capacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Schedule Time *
                </label>
                <input
<input
                  type="text"
                  name="schedule_time"
                  value={formData.schedule_time || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.time ? 'border-error' : ''
                  }`}
                  placeholder="e.g., 9:00 AM - 10:30 AM"
                />
                {errors.time && <p className="text-error text-sm mt-1">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Schedule Days *
              </label>
              <div className="flex flex-wrap gap-2">
{weekDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      formData.schedule_days.includes(day)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-surface-700 border-surface-200 hover:bg-surface-50'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              {errors.days && <p className="text-error text-sm mt-1">{errors.days}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                icon="BookPlus"
              >
                Create Course
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
);
};

export default Courses;