import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "w-full",
  height = "h-4",
  variant = "text",
}) => {
  const baseClasses =
    "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  const variantClasses = {
    text: "rounded",
    rectangular: "rounded border-2 border-black",
    circular: "rounded-full border-2 border-black",
    card: "rounded border-4 border-black shadow-[4px_4px_0_0_#000]",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className}`}
    />
  );
};

// Skeleton untuk Author Information
export const AuthorSkeleton: React.FC = () => {
  return (
    <div className="card-brutal">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton variant="rectangular" width="w-6" height="h-6" />
        <Skeleton width="w-48" height="h-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width="w-16" height="h-16" />
          <div className="space-y-2">
            <Skeleton width="w-32" height="h-6" />
            <Skeleton width="w-24" height="h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" width="w-5" height="h-5" />
            <Skeleton width="w-40" height="h-4" />
          </div>
          <Skeleton width="w-36" height="h-4" className="ml-7" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" width="w-5" height="h-5" />
            <Skeleton width="w-32" height="h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" width="w-5" height="h-5" />
            <Skeleton width="w-28" height="h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" width="w-5" height="h-5" />
            <Skeleton width="w-24" height="h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="rectangular" width="w-5" height="h-5" />
            <Skeleton width="w-20" height="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton untuk Metrics Card
export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="card-brutal p-4">
      <Skeleton width="w-16" height="h-8" className="mb-2" />
      <Skeleton width="w-24" height="h-4" />
    </div>
  );
};

// Skeleton untuk Metrics Overview
export const MetricsSkeleton: React.FC = () => {
  return (
    <div className="card-brutal">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton variant="rectangular" width="w-6" height="h-6" />
        <Skeleton width="w-40" height="h-6" />
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scopus Metrics */}
        <div className="card-brutal bg-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton variant="circular" width="w-3" height="h-3" />
            <Skeleton width="w-32" height="h-5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Google Scholar Metrics */}
        <div className="card-brutal bg-green-100">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton variant="circular" width="w-3" height="h-3" />
            <Skeleton width="w-40" height="h-5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Web of Science Metrics */}
        <div className="card-brutal bg-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton variant="circular" width="w-3" height="h-3" />
            <Skeleton width="w-36" height="h-5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton untuk Publication Card
export const PublicationCardSkeleton: React.FC = () => {
  return (
    <div className="card-brutal p-4">
      <div className="flex justify-between items-start mb-3">
        <Skeleton width="w-3/4" height="h-5" />
        <Skeleton width="w-16" height="h-6" variant="rectangular" />
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width="w-4" height="h-4" />
          <Skeleton width="w-48" height="h-4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width="w-4" height="h-4" />
          <Skeleton width="w-32" height="h-4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" width="w-4" height="h-4" />
          <Skeleton width="w-24" height="h-4" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton width="w-16" height="h-6" variant="rectangular" />
        <Skeleton width="w-20" height="h-6" variant="rectangular" />
        <Skeleton width="w-12" height="h-6" variant="rectangular" />
      </div>
    </div>
  );
};

// Skeleton untuk Publications Section
export const PublicationsSkeleton: React.FC = () => {
  return (
    <div className="card-brutal">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton variant="rectangular" width="w-6" height="h-6" />
        <Skeleton width="w-32" height="h-6" />
        <Skeleton
          width="w-16"
          height="h-6"
          variant="rectangular"
          className="ml-auto"
        />
      </div>

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <PublicationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// Skeleton untuk seluruh halaman
export const SintaProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <AuthorSkeleton />
      <MetricsSkeleton />
      <PublicationsSkeleton />
    </div>
  );
};

export default Skeleton;
