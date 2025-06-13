import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import StatCard from '../atoms/StatCard';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import ApperIcon from '../ApperIcon';
import { studentService, courseService } from '@/services';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [students, courses, studentStats, courseStats] = await Promise.all([
        studentService.getAll(),
        courseService.getAll(),
        studentService.getStats(),
        courseService.getStats()
      ]);

      // Calculate additional metrics
      const programDistribution = students.reduce((acc, student) => {
        acc[student.program] = (acc[student.program] || 0) + 1;
        return acc;
      }, {});

      const yearDistribution = students.reduce((acc, student) => {
        acc[`Year ${student.year}`] = (acc[`Year ${student.year}`] || 0) + 1;
        return acc;
      }, {});

      const gpaDistribution = {
        'Excellent (3.5+)': students.filter(s => s.gpa >= 3.5).length,
        'Good (3.0-3.4)': students.filter(s => s.gpa >= 3.0 && s.gpa < 3.5).length,
        'Satisfactory (2.5-2.9)': students.filter(s => s.gpa >= 2.5 && s.gpa < 3.0).length,
        'Below Average (<2.5)': students.filter(s => s.gpa < 2.5).length
      };

      setReportData({
        students,
        courses,
        studentStats,
        courseStats,
        programDistribution,
        yearDistribution,
        gpaDistribution
      });
    } catch (err) {
      setError(err.message || 'Failed to load report data');
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    toast.success(`Exporting ${selectedReport} report as ${format.toUpperCase()}...`);
  };

  const renderOverviewReport = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={reportData.studentStats.total.toLocaleString()}
          change="+8% from last year"
          trend="up"
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Active Courses"
          value={reportData.courseStats.total}
          change="+3 new courses"
          trend="up"
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Average GPA"
          value={reportData.studentStats.averageGpa}
          change="+0.1 improvement"
          trend="up"
          icon="TrendingUp"
          color="success"
        />
        <StatCard
          title="Course Utilization"
          value={`${reportData.courseStats.utilization}%`}
          change="Optimal range"
          trend="neutral"
          icon="BarChart3"
          color="accent"
        />
      </div>

      {/* Program Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
          Student Distribution by Program
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(reportData.programDistribution).map(([program, count]) => (
            <div key={program} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
              <span className="font-medium text-surface-900">{program}</span>
              <span className="text-primary font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
          Academic Performance Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(reportData.gpaDistribution).map(([range, count]) => {
            const percentage = Math.round((count / reportData.students.length) * 100);
            return (
              <div key={range} className="text-center p-4 bg-surface-50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">{count}</div>
                <div className="text-sm text-surface-600 mb-2">{range}</div>
                <div className="text-xs text-surface-500">{percentage}% of students</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStudentReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
          Student Analytics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Year Distribution */}
          <div>
            <h4 className="text-md font-semibold text-surface-800 mb-3">Distribution by Year</h4>
            <div className="space-y-2">
              {Object.entries(reportData.yearDistribution).map(([year, count]) => {
                const percentage = Math.round((count / reportData.students.length) * 100);
                return (
                  <div key={year} className="flex items-center justify-between">
                    <span className="text-surface-700">{year}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-surface-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-surface-900 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Overview */}
          <div>
            <h4 className="text-md font-semibold text-surface-800 mb-3">Status Overview</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="font-medium">Active Students</span>
                </div>
                <span className="text-success font-bold">{reportData.studentStats.active}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-surface-400 rounded-full"></div>
                  <span className="font-medium">Inactive Students</span>
                </div>
                <span className="text-surface-600 font-bold">
                  {reportData.studentStats.total - reportData.studentStats.active}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourseReport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">
          Course Analytics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {reportData.courseStats.totalEnrollment}
            </div>
            <div className="text-sm text-surface-600">Total Enrollments</div>
          </div>
          
          <div className="text-center p-4 bg-secondary/5 rounded-lg">
            <div className="text-2xl font-bold text-secondary mb-1">
              {reportData.courseStats.averageEnrollment}
            </div>
            <div className="text-sm text-surface-600">Avg per Course</div>
          </div>
          
          <div className="text-center p-4 bg-accent/5 rounded-lg">
            <div className="text-2xl font-bold text-accent mb-1">
              {reportData.courseStats.utilization}%
            </div>
            <div className="text-sm text-surface-600">Capacity Utilization</div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-md font-semibold text-surface-800 mb-4">Course Enrollment Status</h4>
          <div className="space-y-3">
            {reportData.courses.map(course => {
              const utilization = Math.round((course.enrollmentCount / course.capacity) * 100);
              const statusColor = utilization >= 90 ? 'error' : utilization >= 75 ? 'warning' : 'success';
              
              return (
                <div key={course.id} className="flex items-center justify-between p-3 border border-surface-200 rounded-lg">
                  <div>
                    <div className="font-medium text-surface-900">{course.code} - {course.name}</div>
                    <div className="text-sm text-surface-500">{course.instructor}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{course.enrollmentCount} / {course.capacity}</div>
                    <div className={`text-sm text-${statusColor}`}>{utilization}% full</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadReportData} />
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
              Reports & Analytics
            </h1>
            <p className="text-surface-600">
              Comprehensive insights into campus operations
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon="Download"
              onClick={() => exportReport('pdf')}
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon="FileSpreadsheet"
              onClick={() => exportReport('excel')}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* Report Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: 'BarChart3' },
              { id: 'students', label: 'Student Analytics', icon: 'Users' },
              { id: 'courses', label: 'Course Analytics', icon: 'BookOpen' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedReport === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        {reportData && (
          <motion.div
            key={selectedReport}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selectedReport === 'overview' && renderOverviewReport()}
            {selectedReport === 'students' && renderStudentReport()}
            {selectedReport === 'courses' && renderCourseReport()}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Reports;