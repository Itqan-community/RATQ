'use client';

import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { api } from '@/lib/api-client';
import type { NotificationItem } from '@/types/resource';

// ─── Fetch notifications ───────────────────────────────────────────────────

export function useDeveloperNotifications() {
  return useSWR<NotificationItem[], Error>(
    ['developer', 'notifications'],
    () => api.developer.notifications.list()
  );
}

// ─── Mark single notification as read ──────────────────────────────────────

export interface UseMarkNotificationReadReturn {
  markRead: (id: number) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useMarkNotificationRead(): UseMarkNotificationReadReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markRead = useCallback(async (id: number) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.developer.notifications.markRead(id);
      mutate(['developer', 'notifications']);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { markRead, isSubmitting, error };
}

// ─── Mark all notifications as read ────────────────────────────────────────

export interface UseMarkAllNotificationsReadReturn {
  markAllRead: () => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export function useMarkAllNotificationsRead(): UseMarkAllNotificationsReadReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAllRead = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.developer.notifications.markAllRead();
      mutate(['developer', 'notifications']);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { markAllRead, isSubmitting, error };
}
