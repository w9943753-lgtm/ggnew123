import { cn } from "@/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-100 overflow-hidden",
      compact ? "flex gap-3 p-3" : ""
    )}>
      <div className={cn("skeleton", compact ? "w-24 h-24 flex-shrink-0 rounded-xl" : "aspect-square")} />
      <div className={cn("p-3", compact && "flex-1")}>
        <div className="skeleton h-3 w-16 mb-2 rounded" />
        <div className="skeleton h-4 w-full mb-1 rounded" />
        <div className="skeleton h-4 w-3/4 mb-2 rounded" />
        <div className="skeleton h-3 w-20 mb-2 rounded" />
        <div className="skeleton h-5 w-24 rounded" />
        {!compact && <div className="skeleton h-10 w-full mt-3 rounded-xl" />}
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center gap-3">
      <div className="skeleton w-16 h-16 rounded-full" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
  );
}

export function BannerSkeleton() {
  return <div className="skeleton w-full h-48 md:h-72 rounded-2xl" />;
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton h-4 flex-1 rounded" />
      ))}
    </div>
  );
}
