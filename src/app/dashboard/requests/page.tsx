'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/shared/ui/i18n";
import { Sidebar } from "@/shared/ui/layout/Sidebar";
import { RequestCard, RequestCardSkeleton } from "@/modules/developer/components/RequestCard";
import { useDeveloperRequests } from "@/hooks/useDeveloperRequests";



export default function DashboardRequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, direction } = useLanguage();
  const copy = t.dashboard.requests;
  const [isClient, setIsClient] = useState(false);
  const requestsResponse = useDeveloperRequests()

  const filteredRequests = requestsResponse.data?.filter((request) => request.status === 'pending') || [];
  const hasFilterItems = filteredRequests.length === 0 ? false : true

  useEffect(() => {
    setIsClient(true);
    if (!user) router.push("/login");
  }, [user, router]);

  if (!isClient || !user)
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="h-6 w-32 animate-pulse rounded bg-[#ededed]" />
      </div>
    );
  return (
    <div className="min-h-screen bg-white text-black lg:flex" dir={direction}>
      <Sidebar />
      <div className="pt-32 lg:flex-1">
        <main className="mx-auto max-w-[1180px] px-4 pb-8 pt-4 text-center sm:px-6 lg:px-8">
          <section className="rounded-2xl bg-[linear-gradient(122.15deg,#FCEDEA_30.7%,#F4D3CC_86.27%)] p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">
              {copy.badge}
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight text-black sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#59636d]">
              {copy.subtitle}
            </p>
          </section>
          <section className="mt-7 grid gap-4 text-start">


            {
              requestsResponse.isLoading ? (

                Array.from({ length: 3 }).map((_, i) => (
                  <RequestCardSkeleton key={i} />
                ))

              ) : !hasFilterItems ? (

                <div className="text-center text-[#6f7780]">
                  {t.dashboard.requests.noRequests}
                </div>

              ) : (
                filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                  />
                ))
              )}
          </section>
        </main>
      </div>
    </div>
  );
}
