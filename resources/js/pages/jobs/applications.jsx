// pages/jobs/applications.jsx

import React from 'react';
import { usePage } from '@inertiajs/react';
import ApplicationsIndex from '../applications/index';

const JobApplications = ({ applications, filters }) => {
  const { auth } = usePage().props;
  const userRole = auth?.user?.role || 'employer';

  return (
    <ApplicationsIndex
      applications={applications}
      filters={filters || {}}
      userRole={userRole}
    />
  );
};

export default JobApplications;
