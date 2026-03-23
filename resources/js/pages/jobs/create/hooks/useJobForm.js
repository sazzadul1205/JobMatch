// pages/jobs/create/hooks/useJobForm.js

import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export const useJobForm = (storeUrl) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [keywordList, setKeywordList] = useState([]);
    const [benefitsList, setBenefitsList] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary_range: '',
        job_type: '',
        category: '',
        experience_level: '',
        keywords: [],
        keywordInput: '',
        application_deadline: '',
        is_active: true,
        benefits: [],
        benefitInput: '',
        remote_policy: '',
        work_hours: '',
        company_name: '',
        company_website: '',
        contact_email: '',
        contact_phone: '',
    });

    // Add keyword to list
    const addKeyword = () => {
        if (data.keywordInput.trim() && !keywordList.includes(data.keywordInput.trim())) {
            const newKeywords = [...keywordList, data.keywordInput.trim()];
            setKeywordList(newKeywords);
            setData('keywords', newKeywords);
            setData('keywordInput', '');
        }
    };

    // Remove keyword from list
    const removeKeyword = (keywordToRemove) => {
        const newKeywords = keywordList.filter((k) => k !== keywordToRemove);
        setKeywordList(newKeywords);
        setData('keywords', newKeywords);
    };

    // Add benefit
    const addBenefit = () => {
        if (data.benefitInput.trim() && !benefitsList.includes(data.benefitInput.trim())) {
            const newBenefits = [...benefitsList, data.benefitInput.trim()];
            setBenefitsList(newBenefits);
            setData('benefits', newBenefits);
            setData('benefitInput', '');
        }
    };

    // Remove benefit
    const removeBenefit = (benefitToRemove) => {
        const newBenefits = benefitsList.filter((b) => b !== benefitToRemove);
        setBenefitsList(newBenefits);
        setData('benefits', newBenefits);
    };

    // Handle Enter key for keywords
    const handleKeywordKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
        }
    };

    // Handle Enter key for benefits
    const handleBenefitKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addBenefit();
        }
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);
    const goToStep = (step) => setCurrentStep(step);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(storeUrl); // Use the passed URL
    };

    return {
        // State
        data,
        setData,
        currentStep,
        keywordList,
        benefitsList,
        processing,
        errors,

        // Actions
        addKeyword,
        removeKeyword,
        addBenefit,
        removeBenefit,
        handleKeywordKeyPress,
        handleBenefitKeyPress,
        nextStep,
        prevStep,
        goToStep,
        handleSubmit,

        // Helpers
        reset,
    };
};
