// resources/js/Components/Sidebar.jsx

// React
import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

// Icons
import {
  FiHome,
  FiBell,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiUser,
  FiSearch,
  FiPlusCircle,
  FiUsers,
} from 'react-icons/fi';
import { MdCategory } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";

const Sidebar = () => {
  const { url, props } = usePage();
  const { auth } = props;
  const notificationMeta = props.notifications || { unread_count: 0, recent: [] };

  // Get user role
  const user = auth?.user;
  const userName = user?.name || 'User';
  const userRole = user?.role || 'job_seeker';

  // State to track open menus
  const [openMenus, setOpenMenus] = useState({
    jobs: false,
    applications: false,
  });

  // Auto-expand menus based on current URL
  useEffect(() => {
    const newOpenMenus = { ...openMenus };

    // Check if current URL is in jobs management section
    if (url.includes('/job-listings') || url.includes('/locations') || url.includes('/categories')) {
      newOpenMenus.jobs = true;
    }

    // Check if current URL is in applications section
    if (url.includes('/applications')) {
      newOpenMenus.applications = true;
    }

    setOpenMenus(newOpenMenus);
  }, [url]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const route = (name, params = {}) => {
    if (typeof window !== 'undefined' && window.route) {
      try {
        return window.route(name, params);
      } catch (e) {
        return '#';
      }
    }
    return '#';
  };

  // Helper function to check if a route is active - FIXED
  const normalizeUrl = (value) => {
    if (!value) return '';
    const absolute = typeof value === 'string' ? value : value.toString();
    // Convert absolute URL to path only
    const pathOnly = absolute.replace(/^https?:\/\/[^/]+/i, '');
    return pathOnly.replace(/\/$/, '');
  };

  const isRouteActive = (routeName, params = {}, aliasPaths = []) => {
    try {
      const routeUrl = route(routeName, params);
      if (routeUrl === '#') return false;

      const normalizedUrl = normalizeUrl(url);
      const normalizedRouteUrl = normalizeUrl(routeUrl);
      const normalizedAliases = (aliasPaths || [])
        .filter(Boolean)
        .map((path) => normalizeUrl(path));

      // Exact match
      if (normalizedUrl === normalizedRouteUrl) return true;

      // Alias match
      if (normalizedAliases.some((alias) => normalizedUrl === alias || normalizedUrl.startsWith(alias))) {
        return true;
      }

      // Check if current URL starts with route URL (for nested routes)
      // But only if the route URL is longer than just the base path
      if (normalizedRouteUrl !== '/' && normalizedUrl.startsWith(normalizedRouteUrl)) {
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  };

  // Helper function to check if a path is active
  const isPathActive = (path) => {
    if (!path || path === '#') return false;

    const normalizedUrl = normalizeUrl(url);
    const normalizedPath = normalizeUrl(path);

    if (normalizedUrl === normalizedPath) return true;
    if (normalizedPath !== '/' && normalizedUrl.startsWith(normalizedPath)) return true;

    return false;
  };

  // Check if any subitem in a dropdown is active
  const isDropdownActive = (subItems) => {
    return subItems?.some(subItem => {
      if (subItem.href && subItem.href !== '#') {
        return isPathActive(subItem.href);
      }
      if (subItem.routeName) {
        return isRouteActive(subItem.routeName, subItem.routeParams || {});
      }
      return false;
    });
  };

  // Job Seeker Menu Items with route names
  const jobSeekerItems = [
    {
      name: 'Dashboard',
      routeName: 'dashboard',
      icon: FiHome,
    },
    {
      name: 'Browse Jobs',
      routeName: 'backend.public-jobs.index',
      icon: FiSearch,
    },
    {
      name: 'Applicant Profile',
      routeName: 'backend.applicant.profile.show',
      routeParams: { id: user?.id },
      activeAliases: user?.id ? [`/backend/applicant/profile/${user.id}`] : [],
      icon: FiUser,
    },
    {
      name: 'My Applications',
      routeName: 'backend.apply.index',
      icon: FiFileText,
    },
    {
      name: 'Notifications',
      routeName: 'backend.notifications.index',
      icon: FiBell,
      badgeCount: notificationMeta.unread_count,
    },

  ];

  // Employer Menu Items with route names
  const employerItems = [
    {
      name: 'Dashboard',
      routeName: 'dashboard',
      icon: FiHome,
    },
    {
      name: 'Job Listings',
      routeName: 'backend.listing.index',
      icon: FiBriefcase,
    },
    {
      name: 'All Applications',
      routeName: 'backend.applications.index',
      icon: FiFileText,
    },
    {
      name: 'Profile Settings',
      routeName: 'settings.profile',
      icon: FiUser,
    },
  ];

  // Admin Menu Items with route names
  const adminItems = [
    {
      name: 'Dashboard',
      routeName: 'dashboard',
      icon: FiHome,
    },
    {
      name: 'Jobs Management',
      icon: FiBriefcase,
      isDropdown: true,
      dropdownKey: 'jobs',
      subItems: [
        {
          name: 'All Jobs',
          routeName: 'backend.listing.index',
          icon: FiBriefcase,
        },
        {
          name: 'Create New Job',
          routeName: 'backend.listing.create',
          icon: FiPlusCircle,
        },
        {
          name: 'Job Locations',
          routeName: 'backend.locations.index',
          icon: FaSearchLocation,
        },
        {
          name: 'Job Categories',
          routeName: 'backend.categories.index',
          icon: MdCategory,
        },
      ],
    },
    {
      name: 'Applications',
      icon: FiFileText,
      isDropdown: true,
      dropdownKey: 'applications',
      subItems: [
        {
          name: 'All Applications',
          routeName: 'backend.application.index',
          routeParams: {},
        },
        {
          name: 'Pending',
          routeName: 'backend.application.index',
          routeParams: { status: 'pending' },
        },
        {
          name: 'Reviewed',
          routeName: 'backend.application.index',
          routeParams: { status: 'reviewed' },
        },
        {
          name: 'Shortlisted',
          routeName: 'backend.application.index',
          routeParams: { status: 'shortlisted' },
        },
        {
          name: 'Rejected',
          routeName: 'backend.application.index',
          routeParams: { status: 'rejected' },
        },
      ],
    },
    {
      name: 'Users Management',
      routeName: 'admin.users.index',
      icon: FiUsers,
    },
    {
      name: 'System Settings',
      routeName: 'admin.settings',
      icon: FiSettings,
    },
  ];

  // Get menu items based on user role
  const getMenuItems = () => {
    if (userRole === 'job_seeker') return jobSeekerItems;
    if (userRole === 'employer') return employerItems;
    if (userRole === 'admin') return adminItems;
    return [];
  };

  // Get menu items
  const menuItems = getMenuItems();

  // Render menu item
  const renderMenuItem = (item) => {
    if (item.isDropdown) {
      const isOpen = openMenus[item.dropdownKey];
      const isDropdownItemActive = isDropdownActive(item.subItems);

      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleMenu(item.dropdownKey)}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all duration-200
              ${isDropdownItemActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${isDropdownItemActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span className="font-medium">{item.name}</span>
            </div>
            {isOpen ? (
              <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownItemActive ? 'text-blue-600' : ''}`} />
            ) : (
              <FiChevronRight className={`w-4 h-4 transition-transform duration-200 ${isDropdownItemActive ? 'text-blue-600' : ''}`} />
            )}
          </button>

          {isOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {item.subItems.map((subItem) => {
                const isActiveSub = subItem.routeName
                  ? isRouteActive(subItem.routeName, subItem.routeParams || {})
                  : isPathActive(subItem.href);

                return (
                  <Link
                    key={subItem.name}
                    href={subItem.routeName ? route(subItem.routeName, subItem.routeParams || {}) : subItem.href}
                    className={`
                      flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200
                      ${isActiveSub
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-400 font-medium border-l-3 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {subItem.icon && <subItem.icon className={`w-4 h-4 ${isActiveSub ? 'text-blue-600' : ''}`} />}
                    <span>{subItem.name}</span>
                    {isActiveSub && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // For non-dropdown items
    const isMenuItemActive = item.routeName
      ? isRouteActive(item.routeName, item.routeParams || {}, item.activeAliases || [])
      : isPathActive(item.href);

    return (
      <Link
        key={item.name}
        href={item.routeName ? route(item.routeName, item.routeParams || {}) : item.href}
        className={`
          flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 mb-1 relative
          ${isMenuItemActive
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }
        `}
      >
        <item.icon className={`w-5 h-5 ${isMenuItemActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
        <span>{item.name}</span>
        {item.badgeCount > 0 && (
          <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
            {item.badgeCount > 99 ? '99+' : item.badgeCount}
          </span>
        )}
        {isMenuItemActive && (
          <>
            <span className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"></span>
            {!(item.badgeCount > 0) && <span className="ml-auto w-2 h-2 rounded-full bg-blue-600"></span>}
          </>
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href={route('home')} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
            <FiBriefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            JobPortal
          </span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${userRole === 'admin' ? 'bg-red-500' : userRole === 'employer' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
              {userRole === 'admin' ? 'Administrator' : userRole === 'employer' ? 'Employer' : 'Job Seeker'}
            </p>
          </div>
        </div>

        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
