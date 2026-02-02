import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  return (
    <div className="w-full bg-white rounded-b-2xl overflow-hidden">
      {/* Simulate Header */}
      <div className="w-full h-14 bg-gray-100 flex items-center px-6">
          <Skeleton className="h-4 w-1/4 bg-gray-300" />
          <Skeleton className="h-4 w-1/4 bg-gray-300 ml-auto" />
          <Skeleton className="h-4 w-1/4 bg-gray-300 ml-auto" />
      </div>

      <div className="divide-y divide-gray-50">
        {Array.from({ length: rowCount }).map((_, i) => (
          <div key={i} className="flex items-center px-6 py-4">
            <Skeleton className="h-4 w-1/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/4 bg-gray-200 ml-auto" />
            <Skeleton className="h-4 w-1/4 bg-gray-200 ml-auto" />
            <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
