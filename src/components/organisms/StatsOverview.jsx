import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '../atoms/StatCard';
import SkeletonLoader from '../atoms/SkeletonLoader';
import ErrorState from '../atoms/ErrorState';
import { studentService, courseService } from '@/services';

const StatsOverview = ({ className = '' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentStats, courseStats] = await Promise.all([
        studentService.getStats(),
        courseService.getStats()
      ]);
      
      setStats({
        students: studentStats,
        courses: courseStats
      });
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonLoader count={4} type="stat" className={className} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadStats} className={className} />;
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats.students.total.toLocaleString(),
      change: '+12% from last semester',
      trend: 'up',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Active Courses',
      value: stats.courses.total.toString(),
      change: '+3 new courses',
      trend: 'up',
      icon: 'BookOpen',
      color: 'secondary'
    },
    {
      title: 'Average GPA',
      value: stats.students.averageGpa.toString(),
      change: '+0.1 from last term',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Course Utilization',
      value: `${stats.courses.utilization}%`,
      change: 'Optimal capacity',
      trend: 'neutral',
      icon: 'BarChart3',
      color: 'accent'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;