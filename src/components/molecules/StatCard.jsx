import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, change, icon, trend = "up" }) => {
  const trendColor = trend === "up" ? "text-success-600" : "text-error-600";
  const trendIcon = trend === "up" ? "TrendingUp" : "TrendingDown";

  return (
    <div className="bg-white rounded-lg p-6 card-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center ${trendColor}`}>
            <ApperIcon name={trendIcon} className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;