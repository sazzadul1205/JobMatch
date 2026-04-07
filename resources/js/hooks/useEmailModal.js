import { useState, useCallback } from 'react';

const useEmailModal = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [emailModalTitle, setEmailModalTitle] = useState('Send Email');

  const openEmailModal = useCallback((recipients, title = 'Send Email') => {
    // recipients can be a single applicant object or an array of applicants
    const recipientsArray = Array.isArray(recipients) ? recipients : [recipients];
    setEmailRecipients(recipientsArray);
    setEmailModalTitle(title);
    setIsEmailModalOpen(true);
  }, []);

  const closeEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
    setEmailRecipients([]);
  }, []);

  return {
    isEmailModalOpen,
    emailRecipients,
    emailModalTitle,
    openEmailModal,
    closeEmailModal,
  };
};

export default useEmailModal;