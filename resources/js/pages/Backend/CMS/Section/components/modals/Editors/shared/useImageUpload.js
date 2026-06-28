// resources/js/pages/Backend/CMS/Section/components/modals/Editors/shared/useImageUpload.js

import { useState } from 'react';

export const useImageUpload = (initialSrc = '') => {
  const [imageSrc, setImageSrc] = useState(initialSrc);
  const [imageChanged, setImageChanged] = useState(false);
  const [oldImagePath, setOldImagePath] = useState(initialSrc);

  // Functions to handle image upload
  const handleImageChange = (newSrc) => {
    if (!imageChanged && imageSrc) {
      setOldImagePath(imageSrc);
    }
    setImageSrc(newSrc);
    setImageChanged(true);
  };

  // Function to handle image removal
  const handleImageRemove = () => {
    if (!imageChanged && imageSrc) {
      setOldImagePath(imageSrc);
    }
    setImageSrc('');
    setImageChanged(true);
  };

  // Function to reset the image
  const resetImage = () => {
    setImageSrc(initialSrc);
    setImageChanged(false);
    setOldImagePath(initialSrc);
  };

  return {
    imageSrc,
    imageChanged,
    oldImagePath,
    handleImageChange,
    handleImageRemove,
    resetImage,
    setImageSrc,
    setImageChanged,
    setOldImagePath,
  };
};