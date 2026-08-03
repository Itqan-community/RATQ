'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import type { TrendingResource, TrendingPeriod } from '@/types/announcement';
import { api } from '@/lib/api-client';

export interface UseTrendingResourcesReturn {
  resources: TrendingResource[];
  isLoading: boolean;
  error: Error | null;
  period: TrendingPeriod;
  setPeriod: (period: TrendingPeriod) => void;
  periods: TrendingPeriod[];
}

const ALL_PERIODS: TrendingPeriod[] = ['7d', '30d', 'all-time'];

export function useTrendingResources(): UseTrendingResourcesReturn {
  const [period, setPeriod] = useState<TrendingPeriod>('30d');

  const { data, error, isLoading } = useSWR<TrendingResource[], Error>(
    ['trending', period],
    () => api.trending.list(period)
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
