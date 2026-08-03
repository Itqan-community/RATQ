export function CardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="badge skeleton" style={{ width: 60, height: 22 }} />
      </div>
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="space-y-2 mb-4">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
      </div>
      <div className="pt-3 border-t border-[var(--border-color)]">
        <div className="flex justify-between">
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="badge skeleton" style={{ width: 60, height: 22 }} />
            <div className="badge skeleton" style={{ width: 50, height: 22 }} />
          </div>
          <div className="skeleton h-5 w-3/4 mb-3" />
          <div className="space-y-2 mb-4 flex-grow">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
          </div>
          <div className="pt-3 border-t border-[var(--border-color)]">
            <div className="flex justify-between">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
