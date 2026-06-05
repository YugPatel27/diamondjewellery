const ProductSkeleton = () => (
  <div className="bg-card animate-pulse">
    <div className="w-full aspect-square bg-muted" />
    <div className="pt-3 pb-4 px-1 space-y-2">
      <div className="h-5 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
      <div className="flex items-center justify-between mt-2">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-8 w-8 bg-muted rounded" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="px-4 sm:px-6 pb-16">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default ProductSkeleton;
