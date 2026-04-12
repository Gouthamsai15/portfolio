import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPortfolio() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:px-8">
      <Skeleton className="h-64 w-full rounded-[2rem]" />
      <div className="grid gap-6 lg:grid-cols-[0.66fr_0.34fr]">
        <div className="space-y-6">
          <Skeleton className="h-56 w-full rounded-[2rem]" />
          <Skeleton className="h-80 w-full rounded-[2rem]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-[2rem]" />
          <Skeleton className="h-56 w-full rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}
