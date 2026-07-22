import React from 'react';

export const TopList = ({ title, items }) => (
  <div className="rounded-2xl bg-white/5 p-4 shadow-md border border-white/6">
    <h3 className="text-sm text-slate-300">{title}</h3>
    <ul className="mt-3 space-y-2">
      {items.map((it, idx) => (
        <li key={idx} className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-white/3">
          <div>
            <div className="font-medium text-white">{it.name}</div>
            <div className="text-xs text-slate-400">{it.meta}</div>
          </div>
          <div className="text-sm text-slate-300">{it.value}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default TopList;
