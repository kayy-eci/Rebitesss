export default function SellerDashboardLoading() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="h-3 w-32 animate-pulse rounded-full bg-sage-200/60" />
            <div className="mt-3 h-9 w-64 max-w-full animate-pulse rounded-full bg-sage-200/50" />
          </div>
          <div className="h-11 w-36 shrink-0 animate-pulse rounded-full bg-sage-100" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="space-y-5 lg:col-span-8">
            <div className="h-[300px] animate-pulse rounded-3xl border border-sage-200/60 bg-sage-100/40" />
            <div className="h-48 animate-pulse rounded-3xl border border-sage-200/60 bg-sage-100/30" />
          </div>
          <div className="space-y-5 lg:col-span-4">
            <div className="h-52 animate-pulse rounded-3xl border border-sage-200/60 bg-sage-100/30" />
            <div className="h-44 animate-pulse rounded-3xl border border-sage-200/60 bg-sage-100/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
