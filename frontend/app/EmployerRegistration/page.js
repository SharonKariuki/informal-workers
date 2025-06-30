'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const {
    formData, errors, isSubmitting,
    handleChange, handleFileChange,
    validate, setFormData, setErrors, setIsSubmitting
  } = useRegistrationForm({
    firstName: '', lastName: '', email: '', phone: '',
    dob: '', gender: '',
    street: '', city: '', state: '', zip: '', country: '',
    idFront: null, idBack: null,
    hasCriminalRecord: 'no', explanation: '',
    confirmInfo: false, consent: false
  });

  // Auto-fill email from localStorage after login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      setFormData((prev) => ({ ...prev, email: storedUser.email }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }
      data.append('role', 'employer');

      const res = await fetch('http://localhost:5000/api/employers/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Registration failed');

      alert('Employer registered successfully!');
      router.push('/profile/pending'); // or your target route
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-8">
      <BaseFormLayout
        title="Register as an Employer"
        description="Create your profile to start hiring top talent"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {/* Personal Info */}
        <Section title="Personal Information" icon="👤">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name*" error={errors.firstName} />
            <FormInput name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name*" error={errors.lastName} />
            <FormInput type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address*" error={errors.email} />
            <div className="space-y-1">
              <PhoneInput
                country="ke"
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone })}
                placeholder="Phone Number*"
                inputClass="!w-full !h-12 !pl-14 !rounded-lg !border-gray-300 !focus:ring-2 !focus:ring-indigo-500 !focus:border-transparent !text-gray-800"
                dropdownClass="!rounded-lg !border !border-gray-200 !shadow-lg"
                buttonClass="!rounded-l-lg !bg-gray-100 !border-r !border-gray-300"
                containerClass={`!w-full ${errors.phone ? '!border-red-500 !rounded-lg' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <FormInput type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth*" error={errors.dob} />
            <div className="space-y-1">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${formData.gender ? 'text-gray-800' : 'text-gray-400'} bg-white`}
              >
                <option value="" disabled hidden>Gender*</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
        </Section>

        {/* Address Info */}
        <Section title="Address Information" icon="📍">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput name="street" value={formData.street} onChange={handleChange} placeholder="Street Address*" error={errors.street} />
            <FormInput name="city" value={formData.city} onChange={handleChange} placeholder="City*" error={errors.city} />
            <FormInput name="state" value={formData.state} onChange={handleChange} placeholder="State/Province*" error={errors.state} />
            <FormInput name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip/Postal Code*" error={errors.zip} />
            <FormInput name="country" value={formData.country} onChange={handleChange} placeholder="Country*" error={errors.country} />
          </div>
        </Section>

        {/* ID Verification */}
        <Section title="ID Verification" icon="🪪">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Background Check */}
        <Section title="Background Declaration" icon="🔍">
          <label className="block text-gray-700 font-medium">Do you have any criminal record?*</label>
          <div className="flex flex-wrap gap-6 mt-2">
            <RadioButton
              name="hasCriminalRecord"
              value="no"
              label="No"
              checked={formData.hasCriminalRecord === 'no'}
              onChange={() => setFormData({ ...formData, hasCriminalRecord: 'no' })}
            />
            <RadioButton
              name="hasCriminalRecord"
              value="yes"
              label="Yes"
              checked={formData.hasCriminalRecord === 'yes'}
              onChange={() => setFormData({ ...formData, hasCriminalRecord: 'yes' })}
            />
          </div>
          {formData.hasCriminalRecord === 'yes' && (
            <div className="mt-4 space-y-1">
              <label className="block text-gray-700 font-medium">Explain further*</label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.explanation && <p className="text-red-500 text-xs mt-1">{errors.explanation}</p>}
            </div>
          )}
        </Section>

        {/* Consent */}
        <Section title="Terms & Conditions" icon="✅">
          <div className="space-y-4">
            <Checkbox
              name="confirmInfo"
              checked={formData.confirmInfo}
              onChange={handleChange}
              label="I certify that all information is accurate."
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
    </div>
  );
}
