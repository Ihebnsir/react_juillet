import React from 'react';

export const ProgressBar = ({ value, label }) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-sm text-gray-600 dark:text-slate-300">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-slate-700">
      <div className="h-2.5 rounded-full bg-teal-600" style={{ width: `${value}%` }} />
    </div>
  </div>
);
