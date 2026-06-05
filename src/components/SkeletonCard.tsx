export function AnnouncementSkeletonCard() {
  return (
    <div className="bg-white rounded-md border border-neutral-200 p-4 animate-pulse">
      <div className="h-4 bg-neutral-200 rounded w-16 mb-3" />
      <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3" />
      <div className="flex gap-2">
        <div className="h-3 bg-neutral-200 rounded w-16" />
        <div className="h-3 bg-neutral-200 rounded w-24" />
      </div>
    </div>
  );
}

export function ToolSkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-neutral-200 rounded-md flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 rounded w-24 mb-2" />
          <div className="h-4 bg-neutral-200 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <div className="h-3 bg-neutral-200 rounded w-20" />
        <div className="h-3 bg-neutral-200 rounded w-28" />
      </div>
    </div>
  );
}
