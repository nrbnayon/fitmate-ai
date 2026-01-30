import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rowCount = 7 }: { rowCount?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-[#F1F4F9] text-left">
            {Array.from({ length: 7 }).map((_, i) => (
              <th key={i} className="py-4 px-6">
                <Skeleton className="h-4 w-24 bg-gray-300" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.from({ length: rowCount }).map((_, i) => (
            <tr key={i}>
              <td className="py-4 px-6">
                <Skeleton className="h-4 w-32 bg-gray-200" />
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-4 w-40 bg-gray-200" />
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-4 w-32 bg-gray-200" />
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-4 w-16 bg-gray-200" />
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-4 w-20 bg-gray-200" />
              </td>
              <td className="py-4 px-6">
                <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
              </td>
              <td className="py-4 px-6 flex justify-center">
                 <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
