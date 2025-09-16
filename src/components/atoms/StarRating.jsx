import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const StarRating = ({ 
  label, 
  name, 
  value = 0, 
  onChange, 
  error, 
  className,
  maxStars = 5,
  ...props 
}) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (starValue) => {
    const event = {
      target: {
        name,
        value: starValue
      }
    };
    onChange(event);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex items-center space-x-1">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= (hoveredStar || value);
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => setHoveredStar(starValue)}
              onMouseLeave={() => setHoveredStar(0)}
              className={cn(
                "p-1 transition-colors duration-150",
                "hover:scale-110 transform transition-transform"
              )}
              {...props}
            >
              <ApperIcon
                name="Star"
                size={20}
                className={cn(
                  "transition-colors duration-150",
                  isActive ? "text-yellow-400 fill-current" : "text-gray-300"
                )}
              />
            </button>
          );
        })}
        <span className="ml-2 text-sm text-gray-600">
          {value > 0 ? `${value}/${maxStars}` : 'No rating'}
        </span>
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default StarRating;