import React from 'react';

const StatsCard = ({ title, value, icon, color, description }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600'
  };

  const selectedColor = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-5 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-200">
      <div className={`p-4 rounded-2xl ${selectedColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-gray-900 leading-none">{value}</h3>
            {description && <span className="text-xs font-bold text-gray-400">{description}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
