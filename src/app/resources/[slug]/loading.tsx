export default function ResourceDetailLoading() {
  return (
    <div className="bg-white pb-10 pt-32 text-black sm:pt-36" aria-busy="true">
      <main className="mx-auto max-w-[1050px] animate-pulse px-4 sm:px-6">
        <div className="h-8 w-28 rounded-full bg-[#eee]" />
        <div className="mt-5 h-10 w-2/3 rounded-lg bg-[#eee]" />
        <div className="mt-4 h-4 w-1/3 rounded bg-[#f3f3f3]" />
        <div className="mt-7 grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
          <div className="h-40 rounded-xl bg-[#f3f3f3]" />
          <div className="space-y-3">
            <div className="h-6 w-40 rounded bg-[#eee]" />
            <div className="h-4 w-full rounded bg-[#f3f3f3]" />
            <div className="h-4 w-full rounded bg-[#f3f3f3]" />
            <div className="h-4 w-3/4 rounded bg-[#f3f3f3]" />
          </div>
        </div>
      </main>
    </div>
  );
}
