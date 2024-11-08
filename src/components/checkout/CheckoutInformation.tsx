import React from 'react';
import { ChevronRight } from 'lucide-react';

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  // Add more countries as needed
];

interface CheckoutInformationProps {
  formData: {
    firstName: string;
    lastName: string;
    country: string;
    address1: string;
    address2: string;
    postalCode: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    country: string;
    address1: string;
    address2: string;
    postalCode: string;
  }>>;
  onNext: () => void;
}

export function CheckoutInformation({
  formData,
  setFormData,
  onNext
}: CheckoutInformationProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.country &&
      formData.address1 &&
      formData.postalCode
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-michroma mb-6">Shipping Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Country
        </label>
        <select
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="w-full px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          required
        >
          <option value="">Select a country</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Address Line 1
        </label>
        <input
          type="text"
          value={formData.address1}
          onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
          className="w-full px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          placeholder="Street address, P.O. box, company name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Address Line 2
        </label>
        <input
          type="text"
          value={formData.address2}
          onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
          className="w-full px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Postal Code
        </label>
        <input
          type="text"
          value={formData.postalCode}
          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
          className="w-full px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!isFormValid()}
          className="px-6 py-3 bg-primary text-white rounded-lg font-michroma flex items-center gap-2 hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}