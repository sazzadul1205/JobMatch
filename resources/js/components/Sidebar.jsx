// resources/js/Components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  FiHome,
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
  FiTrendingUp
} from 'react-icons/fi';
import { MdCategory } from "react-icons/md";
import { FaBuilding, FaSearchLocation } from "react-icons/fa";

const Sidebar = () => {
  const { url, props } = usePage();
  const { auth } = props;
  const user = auth?.user;
  const userRole = user?.role || 'job_seeker';
  const userName = user?.name || 'User';

  const [openMenus, setOpenMenus] = useState({
    jobs: false,
    applications: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => {
    if (!path) return false;
    return url.startsWith(path);
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

  // Job Seeker Menu Items
  const jobSeekerItems = [
    {
      name: 'Dashboard',
      href: route('dashboard'),
      icon: FiHome,
    },
    {
      name: 'Browse Jobs',
      href: route('backend.listing.index'),
      icon: FiSearch,
    },
    {
      name: 'My Applications',
      icon: FiFileText,
      isDropdown: true,
      dropdownKey: 'applications',
      subItems: [
        {
          name: 'All Applications',
          href: route('backend.application.index'),
        },
        {
          name: 'Pending',
          href: route('backend.application.index', { status: 'pending' }),
        },
        {
          name: 'Reviewed',
          href: route('backend.application.index', { status: 'reviewed' }),
        },
        {
          name: 'Shortlisted',
          href: route('backend.application.index', { status: 'shortlisted' }),
        },
        {
          name: 'Rejected',
          href: route('backend.application.index', { status: 'rejected' }),
        },
      ],
    },
    {
      name: 'Profile',
      href: route('settings.profile'),
      icon: FiUser,
    },
  ];

  // Employer Menu Items
  const employerItems = [
    {
      name: 'Dashboard',
      href: route('dashboard'),
      icon: FiHome,
    },
    {
      name: 'Job Location',
      href: route('backend.locations.index'),
      icon: FaSearchLocation,
    },
    {
      name: 'Job Category',
      href: route('backend.categories.index'),
      icon: MdCategory,
    },
    {
      name: 'Jobs Management',
      icon: FiBriefcase,
      isDropdown: true,
      dropdownKey: 'jobs',
      subItems: [
        {
          name: 'All Jobs',
          href: route('backend.listing.index'),
          icon: FiBriefcase,
        },
        {
          name: 'Create New Job',
          href: route('backend.listing.create'),
          icon: FiPlusCircle,
        },
      ],
    },
    {
      name: 'Applications',
      icon: FiUsers,
      isDropdown: true,
      dropdownKey: 'applications',
      subItems: [
        {
          name: 'All Applications',
          href: route('backend.application.index'),
        },
        {
          name: 'Pending Review',
          href: route('backend.application.index', { status: 'pending' }),
        },
        {
          name: 'Shortlisted',
          href: route('backend.application.index', { status: 'shortlisted' }),
        },
        {
          name: 'Hired',
          href: route('backend.application.index', { status: 'hired' }),
        },
        {
          name: 'Rejected',
          href: route('backend.application.index', { status: 'rejected' }),
        },
      ],
    },
    {
      name: 'Analytics',
      href: route('backend.analytics.dashboard'),
      icon: FiTrendingUp,
    },
    {
      name: 'Company Profile',
      href: route('settings.profile'),
      icon: FaBuilding,
    },
  ];

  // Admin Menu Items
  const adminItems = [
    {
      name: 'Dashboard',
      href: route('dashboard'),
      icon: FiHome,
    },
    {
      name: 'Manage Jobs',
      href: route('backend.listing.index'),
      icon: FiBriefcase,
    },
    {
      name: 'All Applications',
      href: route('backend.application.index'),
      icon: FiFileText,
    },
    {
      name: 'Users',
      href: '#',
      icon: FiUsers,
    },
    {
      name: 'Settings',
      href: '#',
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

  const menuItems = getMenuItems();

  const renderMenuItem = (item) => {
    if (item.isDropdown) {
      const isOpen = openMenus[item.dropdownKey];

      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleMenu(item.dropdownKey)}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all duration-200
              text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </div>
            {isOpen ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </button>

          {isOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={`
                    flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-all duration-200
                    ${isSubItemActive(subItem.href)
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {subItem.icon && <subItem.icon className="w-4 h-4" />}
                  <span>{subItem.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 mb-1
          ${isActive(item.href)
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }
        `}
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  const isSubItemActive = (href) => {
    return url === href;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiBriefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">JobPortal</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
          </div>
        </div>

        <Link
          href={route('logout')}
          method="post"
          as="button"
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
