import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
  );
};

export const CourseCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-48">
    <Skeleton className="h-6 w-1/3 mb-4" />
    <Skeleton className="h-10 w-3/4 mb-4" />
    <div className="mt-auto flex justify-between gap-3">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
    </div>
  </div>
);

export const TaskCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex items-start gap-4">
    <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
    <div className="flex-grow">
      <Skeleton className="h-6 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center gap-5">
                <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
                <div className="flex-grow">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-8 w-12" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
