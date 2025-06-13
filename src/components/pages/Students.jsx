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

  const handleRowClick = (student) => {
    toast.info(`Viewing ${student.name}'s profile`);
  };

  const columns = [
    {
      key: 'name',
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
    },
    {
      key: 'enrolledCourses',
      header: 'Courses',
      render: (value) => `${value.length} enrolled`
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
          <Button icon="UserPlus">
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
              onAction={() => toast.info('Add student functionality would open here')}
            />
          ) : (
            <DataTable
              columns={columns}
              data={filteredStudents}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Students;