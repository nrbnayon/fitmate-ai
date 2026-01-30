import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-[6px_6px_54px_0px_#0000000D] border-none flex flex-col h-full">
          {/* Image */}
          <Skeleton className="aspect-square w-full mb-4 rounded-xl bg-gray-200" />
          
          {/* Title */}
          <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200" />
          
          {/* Price */}
          <Skeleton className="h-6 w-1/3 mb-2 bg-gray-200" />
          
          {/* Rating */}
          <Skeleton className="h-4 w-1/2 mb-4 bg-gray-200" />
          
          {/* Button */}
          <Skeleton className="h-10 w-full rounded-xl mt-auto bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
