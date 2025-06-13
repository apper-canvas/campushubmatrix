import Dashboard from '@/components/pages/Dashboard';
import Students from '@/components/pages/Students';
import Courses from '@/components/pages/Courses';
import Calendar from '@/components/pages/Calendar';
import Communications from '@/components/pages/Communications';
import Reports from '@/components/pages/Reports';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  students: {
    id: 'students',
    label: 'Students',
    path: '/students',
    icon: 'Users',
    component: Students
  },
  courses: {
    id: 'courses',
    label: 'Courses',
    path: '/courses',
    icon: 'BookOpen',
    component: Courses
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  communications: {
    id: 'communications',
    label: 'Communications',
    path: '/communications',
    icon: 'MessageSquare',
    component: Communications
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  }
};

export const routeArray = Object.values(routes);