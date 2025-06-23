'use client';

import { useState } from 'react';
import { validateEmail, validateRequired } from '@/lib/utils/validation';

export const useRegistrationForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.files[0]
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!validateRequired(formData.firstName)) newErrors.firstName = 'First name is required';
    if (!validateRequired(formData.lastName)) newErrors.lastName = 'Last name is required';
    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!validateRequired(formData.phone)) newErrors.phone = 'Phone number is required';
    if (!validateRequired(formData.dob)) newErrors.dob = 'Date of birth is required';
    if (!validateRequired(formData.gender)) newErrors.gender = 'Gender is required';
    if (!validateRequired(formData.street)) newErrors.street = 'Street address is required';
    if (!validateRequired(formData.city)) newErrors.city = 'City is required';
    if (!validateRequired(formData.state)) newErrors.state = 'State/Province is required';
    if (!validateRequired(formData.zip)) newErrors.zip = 'Zip code is required';
    if (!validateRequired(formData.country)) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleFileChange,
    validate
  };
};