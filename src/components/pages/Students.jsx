import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '../molecules/SearchBar';
import DataTable from '../molecules/DataTable';
import Button from '../atoms/Button';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import EmptyState from '../atoms/EmptyState';
import { studentService } from '@/services';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
    year: 1,
    gpa: '',
    status: 'Active'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentService.getAll();
      setStudents(result);
      setFilteredStudents(result);
    } catch (err) {
      setError(err.message || 'Failed to load students');
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      applyFilters(students, selectedProgram);
      return;
    }

    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.email.toLowerCase().includes(query.toLowerCase())
    );
    applyFilters(filtered, selectedProgram);
  };

  const handleProgramFilter = (program) => {
    setSelectedProgram(program);
    applyFilters(students, program);
  };

  const applyFilters = (studentList, program) => {
    let filtered = [...studentList];
    
    if (program !== 'all') {
      filtered = filtered.filter(student => student.program === program);
    }
    
    setFilteredStudents(filtered);
  };

  const getUniquePrograms = () => {
    const programs = [...new Set(students.map(s => s.program))];
    return programs.sort();
  };
const handleAddStudent = () => {
    setShowAddModal(true);
    setFormData({
      name: '',
      email: '',
      program: '',
      year: 1,
      gpa: '',
      status: 'Active'
    });
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      program: '',
      year: 1,
      gpa: '',
      status: 'Active'
    });
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : name === 'gpa' ? parseFloat(value) || '' : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.program.trim()) {
      errors.program = 'Program is required';
    }
    
    if (!formData.gpa || formData.gpa < 0 || formData.gpa > 4) {
      errors.gpa = 'GPA must be between 0.0 and 4.0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      const newStudent = await studentService.create({
        ...formData,
        gpa: parseFloat(formData.gpa),
        enrolledCourses: []
      });
      
      // Update local state
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      applyFilters(updatedStudents, selectedProgram);
      
      toast.success(`${newStudent.name} has been added successfully!`);
      handleCloseModal();
    } catch (err) {
      toast.error(err.message || 'Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

const handleRowClick = (student) => {
    console.log('Student clicked:', student);
    // TODO: Implement student detail view or edit functionality
  };

const columns = [
    {
      key: 'Name',
      header: 'Name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-surface-900">{value}</div>
          <div className="text-sm text-surface-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'program',
      header: 'Program'
    },
    {
      key: 'year',
      header: 'Year',
      render: (value) => `Year ${value}`
    },
    {
      key: 'gpa',
      header: 'GPA',
      render: (value) => (
        <span className={`font-medium ${
          value >= 3.5 ? 'text-success' : 
          value >= 3.0 ? 'text-warning' : 'text-error'
        }`}>
          {value.toFixed(2)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Active' 
            ? 'bg-success/10 text-success' 
            : 'bg-surface-100 text-surface-600'
        }`}>
          {value}
        </span>
      )
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
        <ErrorState message={error} onRetry={loadStudents} />
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
              Student Directory
            </h1>
            <p className="text-surface-600">
              Manage and view student information
            </p>
          </div>
          <Button icon="UserPlus" onClick={handleAddStudent}>
            Add Student
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search students by name or email..."
                onSearch={handleSearch}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-surface-700 whitespace-nowrap">
                Program:
              </span>
              <select
                value={selectedProgram}
                onChange={(e) => handleProgramFilter(e.target.value)}
                className="border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="all">All Programs</option>
                {getUniquePrograms().map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-surface-600">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          </div>
          
          {filteredStudents.length === 0 ? (
            <EmptyState
              icon="Users"
              title="No students found"
              description="Try adjusting your search criteria or add a new student"
              actionLabel="Add Student"
              onAction={handleAddStudent}
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredStudents}
              onRowClick={handleRowClick}
            />
          )}
        </div>
        
        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-surface-900">
                    Add New Student
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        formErrors.name 
                          ? 'border-error focus:border-error focus:ring-error/20' 
                          : 'border-surface-200'
                      }`}
                      placeholder="Enter student's full name"
                    />
                    {formErrors.name && (
                      <p className="text-sm text-error mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        formErrors.email 
                          ? 'border-error focus:border-error focus:ring-error/20' 
                          : 'border-surface-200'
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="text-sm text-error mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Program *
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                        formErrors.program 
                          ? 'border-error focus:border-error focus:ring-error/20' 
                          : 'border-surface-200'
                      }`}
                    >
                      <option value="">Select a program</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Psychology">Psychology</option>
                      <option value="Biology">Biology</option>
                    </select>
                    {formErrors.program && (
                      <p className="text-sm text-error mt-1">{formErrors.program}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Year
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value={1}>Year 1</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        GPA *
                      </label>
                      <input
                        type="number"
                        name="gpa"
                        value={formData.gpa}
                        onChange={handleFormChange}
                        min="0"
                        max="4"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                          formErrors.gpa 
                            ? 'border-error focus:border-error focus:ring-error/20' 
                            : 'border-surface-200'
                        }`}
                        placeholder="0.00"
                      />
                      {formErrors.gpa && (
                        <p className="text-sm text-error mt-1">{formErrors.gpa}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCloseModal}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className={submitting ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      {submitting ? 'Adding...' : 'Add Student'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Students;