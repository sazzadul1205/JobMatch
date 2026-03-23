// pages/jobs/create/utils/validators.js

export const validateStep1 = (data) => {
    const errors = {};
    if (!data.title) errors.title = 'Job title is required';
    if (!data.job_type) errors.job_type = 'Job type is required';
    if (!data.category) errors.category = 'Category is required';
    if (!data.experience_level) errors.experience_level = 'Experience level is required';
    if (!data.location) errors.location = 'Location is required';
    return errors;
};

export const validateStep2 = (data) => {
    const errors = {};
    if (!data.description) errors.description = 'Description is required';
    if (!data.requirements) errors.requirements = 'Requirements are required';
    return errors;
};

export const validateStep3 = (data) => {
    const errors = {};
    if (!data.application_deadline) errors.application_deadline = 'Application deadline is required';
    return errors;
};

export const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};
