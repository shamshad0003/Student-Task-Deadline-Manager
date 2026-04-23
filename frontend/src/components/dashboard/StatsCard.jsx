import React from 'react';

const StatsCard = ({ title, value, icon, color, description }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
  };

  const selectedColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700 flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-none">
      <div className={`p-4 rounded-2xl ${selectedColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{value}</h3>
            {description && <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{description}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
