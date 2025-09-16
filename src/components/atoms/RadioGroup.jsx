import React from 'react';
import { cn } from '@/utils/cn';

const RadioGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error, 
  className,
  ...props 
}) => {
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
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2"
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

export default RadioGroup;