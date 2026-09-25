import type { FirstVisitOffer } from '@/lib/types';

export const firstVisitOffer: FirstVisitOffer = {
  code: 'FIRST15',
  discountPercent: 15,
  appliesTo: 'one-service',
  appliesToFirstVisit: true,
  mentionInStore: true,
  noOnlineDiscountedPrices: true,
  noCountdown: true,
};