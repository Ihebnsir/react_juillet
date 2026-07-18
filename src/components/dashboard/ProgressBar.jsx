import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({ value, label }) => (
  <div>
    <div className="mb-1 flex items-center justify-between text-sm text-gray-600 dark:text-slate-300">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);
