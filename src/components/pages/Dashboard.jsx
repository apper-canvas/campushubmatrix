import React from 'react';
import { motion } from 'framer-motion';
import StatsOverview from '../organisms/StatsOverview';
import RecentAnnouncements from '../organisms/RecentAnnouncements';
import UpcomingEvents from '../organisms/UpcomingEvents';
import Button from '../atoms/Button';

const Dashboard = () => {
  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold mb-2">
                Welcome to CampusHub
              </h1>
              <p className="text-blue-100">
                Your comprehensive college administration dashboard
              </p>
            </div>
            <div className="hidden md:block">
              <Button variant="accent" icon="Plus">
                Quick Action
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <section>
          <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
            Overview Statistics
          </h2>
          <StatsOverview />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Announcements */}
          <section className="min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-surface-900">
                Recent Announcements
              </h2>
              <Button variant="ghost" size="sm" icon="ArrowRight">
                View All
              </Button>
            </div>
            <RecentAnnouncements />
          </section>

          {/* Upcoming Events */}
          <section className="min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-surface-900">
                Upcoming Events
              </h2>
              <Button variant="ghost" size="sm" icon="ArrowRight">
                View Calendar
              </Button>
            </div>
            <UpcomingEvents />
          </section>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button variant="outline" icon="UserPlus" className="justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-medium">Add Student</div>
                <div className="text-xs text-surface-500 mt-1">Register new student</div>
              </div>
            </Button>
            
            <Button variant="outline" icon="BookPlus" className="justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-medium">Create Course</div>
                <div className="text-xs text-surface-500 mt-1">Add new course</div>
              </div>
            </Button>
            
            <Button variant="outline" icon="MessageSquarePlus" className="justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-medium">New Announcement</div>
                <div className="text-xs text-surface-500 mt-1">Create announcement</div>
              </div>
            </Button>
            
            <Button variant="outline" icon="CalendarPlus" className="justify-start p-4 h-auto">
              <div className="text-left">
                <div className="font-medium">Schedule Event</div>
                <div className="text-xs text-surface-500 mt-1">Add calendar event</div>
              </div>
            </Button>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Dashboard;