// resources/js/Pages/Dashboard.jsx

// React
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Icons
import {
  FiBriefcase,
  FiFileText,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiAward,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiActivity,
  FiSmile,
  FiTarget,
  FiThumbsUp
} from 'react-icons/fi';

// Layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Dashboard = () => {
  const { auth, notifications } = usePage().props;
  const userRole = auth.user?.role;
  const [greeting, setGreeting] = useState('');
  const [animateStats, setAnimateStats] = useState(false);
  const recentNotifications = notifications?.recent || [];

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Trigger animation after mount
    setTimeout(() => setAnimateStats(true), 100);
  }, []);

  // Animated counter component
  const AnimatedCounter = ({ value, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (animateStats) {
        let start = 0;
        const duration = 1000;
        const increment = value / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, [value, animateStats]);

    return <span>{count}{suffix}</span>;
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color, suffix = '', delay = 0 }) => (
    <div className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 animate-fade-in-up animation-delay-${delay}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {animateStats ? <AnimatedCounter value={value} suffix={suffix} /> : value}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-linear-to-br ${color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  // Activity Item Component
  const ActivityItem = ({ icon: Icon, title, time, color, status }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group">
      <div className={`p-2 rounded-lg bg-linear-to-br ${color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
          {status && (
            <span className={`text-xs px-2 py-1 rounded-full ${status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                status === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
              {status === 'success' ? 'Completed' : status === 'warning' ? 'Pending' : 'New'}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );

  // Quick Action Button
  const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
    >
      <div className={`p-3 rounded-lg bg-linear-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );

  // Job Seeker Stats
  const jobSeekerStats = [
    { title: 'Applications Sent', value: 12, icon: FiFileText, color: 'from-blue-500 to-blue-600', suffix: '' },
    { title: 'Shortlisted', value: 3, icon: FiStar, color: 'from-green-500 to-emerald-600', suffix: '' },
    { title: 'Interviews', value: 2, icon: FiClock, color: 'from-purple-500 to-purple-600', suffix: '' },
    { title: 'Success Rate', value: 25, icon: FiTrendingUp, color: 'from-yellow-500 to-orange-600', suffix: '%' }
  ];

  // Employer Stats
  const employerStats = [
    { title: 'Active Jobs', value: 8, icon: FiBriefcase, color: 'from-blue-500 to-blue-600', suffix: '' },
    { title: 'Total Applications', value: 156, icon: FiFileText, color: 'from-green-500 to-emerald-600', suffix: '' },
    { title: 'Shortlisted', value: 24, icon: FiStar, color: 'from-purple-500 to-purple-600', suffix: '' },
    { title: 'Hired', value: 6, icon: FiAward, color: 'from-yellow-500 to-orange-600', suffix: '' }
  ];

  // Admin Stats
  const adminStats = [
    { title: 'Total Users', value: 1234, icon: FiUsers, color: 'from-blue-500 to-blue-600', suffix: '' },
    { title: 'Total Jobs', value: 567, icon: FiBriefcase, color: 'from-green-500 to-emerald-600', suffix: '' },
    { title: 'Applications', value: 3891, icon: FiFileText, color: 'from-purple-500 to-purple-600', suffix: '' },
    { title: 'Hiring Rate', value: 18, icon: FiTrendingUp, color: 'from-yellow-500 to-orange-600', suffix: '%' }
  ];

  // Recent Activities based on role
  const getActivities = () => {
    if (userRole === 'job_seeker') {
      if (recentNotifications.length > 0) {
        return recentNotifications.map((notification) => ({
          icon: notification.read_at ? FiBell : FiCheckCircle,
          title: notification.data?.title || 'Application updated',
          time: new Date(notification.created_at).toLocaleString(),
          color: notification.read_at ? 'from-slate-500 to-slate-600' : 'from-blue-500 to-cyan-600',
          status: notification.read_at ? 'success' : 'new',
        }));
      }

      return [
        { icon: FiCheckCircle, title: 'Application submitted for Senior Developer position', time: '2 hours ago', color: 'from-blue-500 to-cyan-600', status: 'success' },
        { icon: FiStar, title: 'Your application has been shortlisted', time: 'Yesterday', color: 'from-green-500 to-emerald-600', status: 'success' },
        { icon: FiCalendar, title: 'Interview scheduled with Tech Corp', time: '2 days ago', color: 'from-purple-500 to-purple-600', status: 'warning' },
        { icon: FiBriefcase, title: 'New job match: Frontend Developer', time: '3 days ago', color: 'from-orange-500 to-red-600', status: 'new' }
      ];
    } else if (userRole === 'employer') {
      return [
        { icon: FiUsers, title: 'New application for Senior Developer', time: '1 hour ago', color: 'from-blue-500 to-cyan-600', status: 'new' },
        { icon: FiStar, title: '3 candidates shortlisted for UI Designer', time: '3 hours ago', color: 'from-green-500 to-emerald-600', status: 'success' },
        { icon: FiCalendar, title: 'Interview scheduled with John Doe', time: 'Yesterday', color: 'from-purple-500 to-purple-600', status: 'warning' },
        { icon: FiBriefcase, title: 'Job posted: Backend Engineer', time: '2 days ago', color: 'from-orange-500 to-red-600', status: 'success' }
      ];
    } else {
      return [
        { icon: FiUsers, title: '50 new users registered today', time: '1 hour ago', color: 'from-blue-500 to-cyan-600', status: 'new' },
        { icon: FiBriefcase, title: '25 new jobs posted', time: '3 hours ago', color: 'from-green-500 to-emerald-600', status: 'success' },
        { icon: FiFileText, title: '150 new applications received', time: 'Yesterday', color: 'from-purple-500 to-purple-600', status: 'warning' },
        { icon: FiTrendingUp, title: 'Platform usage up by 15%', time: '2 days ago', color: 'from-orange-500 to-red-600', status: 'success' }
      ];
    }
  };

  // Quick Actions based on role
  const getQuickActions = () => {
    if (userRole === 'job_seeker') {
      return [
        { icon: FiFileText, label: 'Browse Jobs', color: 'from-blue-500 to-blue-600', onClick: () => window.location.href = '/jobs' },
        { icon: FiTarget, label: 'Upload Resume', color: 'from-green-500 to-emerald-600', onClick: () => window.location.href = '/profile' },
        { icon: FiActivity, label: 'Track Applications', color: 'from-purple-500 to-purple-600', onClick: () => window.location.href = '/applications' },
        { icon: FiBell, label: 'Notifications', color: 'from-orange-500 to-red-600', onClick: () => window.location.href = '/backend/notifications' }
      ];
    } else if (userRole === 'employer') {
      return [
        { icon: FiBriefcase, label: 'Post Job', color: 'from-blue-500 to-blue-600', onClick: () => window.location.href = '/jobs/create' },
        { icon: FiUsers, label: 'Find Talent', color: 'from-green-500 to-emerald-600', onClick: () => window.location.href = '/candidates' },
        { icon: FiFileText, label: 'View Applications', color: 'from-purple-500 to-purple-600', onClick: () => window.location.href = '/applications' },
        { icon: FiBarChart2, label: 'Analytics', color: 'from-orange-500 to-red-600', onClick: () => window.location.href = '/analytics' }
      ];
    } else {
      return [
        { icon: FiUsers, label: 'Manage Users', color: 'from-blue-500 to-blue-600', onClick: () => window.location.href = '/admin/users' },
        { icon: FiBriefcase, label: 'Manage Jobs', color: 'from-green-500 to-emerald-600', onClick: () => window.location.href = '/admin/jobs' },
        { icon: FiBarChart2, label: 'Analytics', color: 'from-purple-500 to-purple-600', onClick: () => window.location.href = '/admin/analytics' },
        { icon: FiBell, label: 'Reports', color: 'from-orange-500 to-red-600', onClick: () => window.location.href = '/admin/reports' }
      ];
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      {/* Welcome Section with Animation */}
      <div className="mb-8 animate-fade-in-up">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {auth.user?.name}! 👋
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your {userRole === 'job_seeker' ? 'job search' : userRole === 'employer' ? 'job postings' : 'platform'} today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <FiSmile className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {userRole === 'job_seeker' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {jobSeekerStats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 100} />
          ))}
        </div>
      )}

      {userRole === 'employer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {employerStats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 100} />
          ))}
        </div>
      )}

      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 100} />
          ))}
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="mb-8 animate-fade-in-up animation-delay-400">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getQuickActions().map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in-up animation-delay-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <FiActivity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {getActivities().map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* Achievement/Motivation Card */}
        <div className="bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 animate-fade-in-up animation-delay-600">
          <div className="text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Progress</h2>
              <FiThumbsUp className="w-6 h-6" />
            </div>
            {userRole === 'job_seeker' && (
              <>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Profile Completion</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <p className="text-sm opacity-90">
                  Complete your profile to increase your chances of getting hired! Add your skills and experience.
                </p>
              </>
            )}
            {userRole === 'employer' && (
              <>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Job Posting Limit</span>
                    <span>8/10</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <p className="text-sm opacity-90">
                  You've posted 8 jobs this month. Upgrade your plan to post more and reach more candidates.
                </p>
              </>
            )}
            {userRole === 'admin' && (
              <>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Platform Growth</span>
                    <span>+23%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <p className="text-sm opacity-90">
                  Platform usage is up 23% this month. Great job! Keep monitoring the growth metrics.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
