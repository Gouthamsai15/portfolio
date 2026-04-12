import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-36 rounded-[1.75rem]" />
        <Skeleton className="h-36 rounded-[1.75rem]" />
        <Skeleton className="h-36 rounded-[1.75rem]" />
      </div>
      <Skeleton className="h-[32rem] rounded-[2rem]" />
    </div>
  );
}
