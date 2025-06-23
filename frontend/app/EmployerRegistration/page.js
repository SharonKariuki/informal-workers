'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  BaseFormLayout, 
  Section, 
  FormInput, 
  FileUpload, 
  RadioButton, 
  Checkbox 
} from '@/components/forms';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';

export default function EmployerRegistrationPage() {
  const [hoveredUpload, setHoveredUpload] = useState(null);
  
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleFileChange,
    validate,
    setFormData,
    setErrors,
    setIsSubmitting
  } = useRegistrationForm({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    hasCriminalRecord: '',
    explanation: '',
    confirmInfo: false,
    consent: false,
    idFront: null,
    idBack: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      console.log('Form submitted:', formData);
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Registration successful!');
      }, 1500);
    }
  };

  return (
    <BaseFormLayout
      title="Get Started Now"
      description="Join our exclusive network of employers"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <Section title="Personal Information" icon="👤">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name*" 
            error={errors.firstName}
            icon="user"
          />
          <FormInput 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name*" 
            error={errors.lastName}
            icon="user"
          />
          <FormInput 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address*" 
            error={errors.email}
            icon="email"
          />
          <div>
            <PhoneInput
              country={'ke'}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              placeholder="Phone Number*"
              inputClass="!w-full !h-11 !pl-14 !rounded-lg !border-gray-300 !focus:ring-2 !focus:ring-blue-500 !focus:border-transparent !text-black"
              dropdownClass="!rounded-lg !border !border-gray-200 !shadow-lg"
              buttonClass="!rounded-l-lg !bg-gray-100 !border-r !border-gray-300"
              containerClass={`!w-full ${errors.phone ? '!border-red-500 !rounded-lg' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
              ${formData.dob ? 'text-black' : 'text-gray-400'} appearance-none`}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
              ${formData.gender ? 'text-black' : 'text-gray-300'}`}
          >
            <option value="" disabled hidden>Gender*</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </Section>

      <Section title="Address Information" icon="📍">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput 
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street Address*" 
            error={errors.street}
            icon="location"
          />
          <FormInput 
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City*" 
            error={errors.city}
            icon="city"
          />
          <FormInput 
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State/Province*" 
            error={errors.state}
            icon="region"
          />
          <FormInput 
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="Zip/Postal Code*" 
            error={errors.zip}
            icon="zip"
          />
          <FormInput 
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country*" 
            error={errors.country}
            icon="globe"
          />
        </div>
      </Section>

      <Section title="ID Verification" icon="🪪">
        <p className="mb-4 text-sm text-gray-600">
          Upload both sides of your government-issued ID
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUpload 
            label="Front Side of ID*"
            side="idFront"
            onChange={(e) => handleFileChange(e, 'idFront')}
            isHovered={hoveredUpload === 'front'}
            onMouseEnter={() => setHoveredUpload('front')}
            onMouseLeave={() => setHoveredUpload(null)}
            error={errors.idFront}
          />
          <FileUpload 
            label="Back Side of ID*"
            side="idBack"
            onChange={(e) => handleFileChange(e, 'idBack')}
            isHovered={hoveredUpload === 'back'}
            onMouseEnter={() => setHoveredUpload('back')}
            onMouseLeave={() => setHoveredUpload(null)}
            error={errors.idBack}
          />
        </div>
      </Section>

      <Section title="Background Declaration" icon="🔍">
        <div className="space-y-3">
          <label className="block text-gray-700 font-medium">
            Do you have any criminal record?*
          </label>
          <div className="flex flex-wrap gap-4">
            <RadioButton 
              name="hasCriminalRecord"
              value="no"
              label="No" 
              checked={formData.hasCriminalRecord === "no"}
              onChange={() => setFormData({...formData, hasCriminalRecord: "no"})}
            />
            <RadioButton 
              name="hasCriminalRecord"
              value="yes"
              label="Yes" 
              checked={formData.hasCriminalRecord === "yes"}
              onChange={() => setFormData({...formData, hasCriminalRecord: "yes"})}
            />
          </div>
          {formData.hasCriminalRecord === "yes" && (
            <div className="mt-3">
              <label className="block text-gray-700 font-medium mb-1">
                Please provide details of the offence*
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                placeholder="e.g., Minor traffic offence in 2020"
                className="w-full px-4 py-2 text-black font-medium rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>
      </Section>

      <Section title="Terms & Conditions" icon="📝">
        <div className="space-y-3">
          <Checkbox 
            name="confirmInfo"
            checked={formData.confirmInfo}
            onChange={handleChange}
            label="I certify that all information provided is accurate and complete."
            error={errors.confirmInfo}
          />
          <Checkbox 
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            label="I agree to the Terms of Service and Privacy Policy."
            error={errors.consent}
          />
        </div>
      </Section>
    </BaseFormLayout>
  );
}