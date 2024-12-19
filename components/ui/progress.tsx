"use client";
import React from "react";

interface ProgressProps {
  value: number;
  max?: number;
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

function Progress({
  value,
  max = 100,
  showPercentage = false,
  label,
  className = "",
}: ProgressProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1 w-full text-center">
          <span className="text-base font-medium text-primary w-full text-center">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm font-medium text-primary text-center">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden ">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out w-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <span className="w-full text-center">{percentage}% Complete</span>
        </div>
      </div>
    </div>
  );
}

export default Progress;
