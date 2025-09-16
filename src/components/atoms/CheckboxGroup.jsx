import React from 'react';
import { cn } from '@/utils/cn';

const CheckboxGroup = ({ 
  label, 
  name, 
  value = [], 
  onChange, 
  options = [], 
  error, 
  className,
  ...props 
}) => {
  const handleCheckboxChange = (optionValue) => {
    const currentValues = Array.isArray(value) ? value : [];
    let newValues;
    
    if (currentValues.includes(optionValue)) {
      newValues = currentValues.filter(v => v !== optionValue);
    } else {
      newValues = [...currentValues, optionValue];
    }
    
    const event = {
      target: {
        name,
        value: newValues
      }
    };
    onChange(event);
  };

  const currentValues = Array.isArray(value) ? value : [];

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={currentValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              {...props}
            />
            <span className="text-sm text-gray-900">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default CheckboxGroup;