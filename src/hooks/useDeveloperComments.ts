'use client';

import useSWR from 'swr';
import { listMyComments } from '@/modules/resources/application/use-cases/list-my-comments';
import type { CommentWithResource } from '@/types/resource';

export function useDeveloperComments() {
  return useSWR<CommentWithResource[], Error>(
    ['developer', 'comments'],
    () => listMyComments()
  );
}
