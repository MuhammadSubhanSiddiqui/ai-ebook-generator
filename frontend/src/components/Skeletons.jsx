import React from 'react';

/**
 * Skeleton loader matching the dimensions and layout of the eBook cards on the dashboard.
 */
export const EbookCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      {/* Cover Skeleton */}
      <div className="h-52 w-full skeleton-shimmer relative">
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5"></div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-6 space-y-4">
        <div className="h-5 w-3/4 rounded-lg skeleton-shimmer"></div>
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded-md skeleton-shimmer"></div>
          <div className="h-3.5 w-5/6 rounded-md skeleton-shimmer"></div>
        </div>

        {/* Footer Meta Skeleton */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="h-3 w-20 rounded skeleton-shimmer"></div>
          <div className="h-5 w-16 rounded-full skeleton-shimmer"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full rounded-xl skeleton-shimmer"></div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader matching the reader layout in EbookViewer.
 */
export const EbookViewerSkeleton = () => {
  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-[#090d16]">
      {/* Header Skeleton */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full skeleton-shimmer"></div>
          <div className="space-y-1.5">
            <div className="h-4 w-48 rounded skeleton-shimmer"></div>
            <div className="h-3 w-24 rounded skeleton-shimmer"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-xl skeleton-shimmer"></div>
          <div className="h-8 w-8 rounded-full skeleton-shimmer"></div>
        </div>
      </div>

      {/* Reader Page Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-900 dark:border dark:border-gray-800 md:p-12 min-h-[75vh] space-y-6">
          <div className="h-8 w-2/3 rounded-lg skeleton-shimmer mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded skeleton-shimmer"></div>
            <div className="h-4 w-full rounded skeleton-shimmer"></div>
            <div className="h-4 w-11/12 rounded skeleton-shimmer"></div>
            <div className="h-4 w-4/5 rounded skeleton-shimmer"></div>
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full rounded skeleton-shimmer"></div>
            <div className="h-4 w-full rounded skeleton-shimmer"></div>
            <div className="h-4 w-3/4 rounded skeleton-shimmer"></div>
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full rounded skeleton-shimmer"></div>
            <div className="h-4 w-5/6 rounded skeleton-shimmer"></div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Skeleton */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="h-8 w-24 rounded-lg skeleton-shimmer"></div>
          <div className="h-4 w-16 rounded skeleton-shimmer"></div>
          <div className="h-8 w-24 rounded-lg skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
};
