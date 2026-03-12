import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white px-5 py-6 rounded-lg flex items-start justify-between h-full shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-col justify-center gap-2 w-full">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-9 w-16 bg-gray-200" />
              <Skeleton className="h-3 w-32 bg-gray-200" />
            </div>
            <Skeleton className="w-14 h-14 rounded-lg bg-gray-200 shrink-0 ml-4" />
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-border">
            <Skeleton className="h-6 w-32 mb-6 bg-gray-200" />
            <Skeleton className="h-[300px] w-full bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Table Section Skeleton */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <Skeleton className="h-6 w-40 bg-gray-200" />
        </div>
        <div className="space-y-4 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full bg-gray-100" />
                <Skeleton className="h-3 w-3/4 bg-gray-50" />
              </div>
              <Skeleton className="h-8 w-20 bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
