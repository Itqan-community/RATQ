'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import type { TrendingResource, PeriodType } from '@/types/announcement';
import { listTrendingResources } from '@/modules/resources/application/use-cases/list-trending-resources';

export interface UseTrendingResourcesReturn {
  resources: TrendingResource[];
  isLoading: boolean;
  error: Error | null;
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  periods: PeriodType[];
}

const ALL_PERIODS: PeriodType[] = ['7d', '30d', 'all-time'];

export function useTrendingResources(): UseTrendingResourcesReturn {
  const [period, setPeriod] = useState<PeriodType>('30d');

  const { data, error, isLoading } = useSWR<TrendingResource[], Error>(
    ['trending', period],
    () => listTrendingResources(period)
  );

  return {
    resources: data ?? [],
    isLoading,
    error: error ?? null,
    period,
    setPeriod,
    periods: ALL_PERIODS,
  };
}
