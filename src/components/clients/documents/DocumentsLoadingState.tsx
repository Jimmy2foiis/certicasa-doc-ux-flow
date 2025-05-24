
interface DocumentsLoadingStateProps {
  count?: number;
}

export const DocumentsLoadingState = ({ count = 5 }: DocumentsLoadingStateProps) => (
  <div className="space-y-3">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
            <div>
              <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 mt-2 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        </div>
      ))}
  </div>
);
