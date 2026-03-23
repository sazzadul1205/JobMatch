// pages/jobs/create/constants.js

export const STEPS = [
    { number: 1, title: 'Basic Info', icon: 'FiBriefcase', description: 'Job title, type & location' },
    { number: 2, title: 'Job Details', icon: 'FiFileText', description: 'Description & requirements' },
    { number: 3, title: 'Settings', icon: 'FiClock', description: 'Deadline & status' },
    { number: 4, title: 'Review', icon: 'FiCheck', description: 'Review & publish' },
];

export const REMOTE_POLICY_OPTIONS = [
    { value: 'fully_remote', label: 'Fully Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' },
];
