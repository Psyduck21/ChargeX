import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Skeleton = ({
  className,
  variant = 'text',
  lines = 1,
  animate = true,
  ...props
}) => {
  const baseStyles = 'bg-hover relative overflow-hidden';

  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-6 w-3/4 rounded',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    rectangle: 'h-32 w-full rounded-lg',
    square: 'w-32 h-32 rounded-lg',
    circle: 'w-12 h-12 rounded-full',
  };

  const shimmerClasses = animate
    ? 'shimmer before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.5s_ease-in-out_infinite]'
    : '';

  if (lines > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={clsx(baseStyles, variants.text, shimmerClasses)}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={clsx(baseStyles, variants[variant], shimmerClasses, className)}
      initial={{ opacity: 0.5 }}
      animate={animate ? { opacity: [0.5, 1, 0.5] } : {}}
      transition={{
        duration: animate ? 1.5 : 0,
        repeat: animate ? Infinity : 0,
        ease: 'easeInOut',
      }}
      {...props}
    />
  );
};

const SkeletonCard = ({ className, ...props }) => (
  <div className={clsx('rounded-xl border border-border bg-card p-6 shadow-card', className)}>
    <div className="space-y-4">
      <Skeleton variant="title" />
      <Skeleton lines={2} />
      <div className="flex space-x-3">
        <Skeleton className="w-20" />
        <Skeleton className="w-16" />
      </div>
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 3 }) => (
  <div className="rounded-xl border border-border bg-card shadow-card">
    {/* Table Header */}
    <div className="border-b border-border p-4">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-4 w-20" />
        ))}
      </div>
    </div>

    {/* Table Rows */}
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 w-24" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonChart = ({ className }) => (
  <div className={clsx('rounded-xl border border-border bg-card p-6 shadow-card', className)}>
    <div className="space-y-4">
      <Skeleton variant="title" className="w-48" />
      <Skeleton className="h-64 w-full" />
      <div className="flex justify-center space-x-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-14" />
      </div>
    </div>
  </div>
);

export { SkeletonCard, SkeletonTable, SkeletonChart };
export default Skeleton;
