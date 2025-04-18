import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SubscriptionBadgeProps {
  tier: string;
  className?: string;
}

export function SubscriptionBadge({ tier, className = '' }: SubscriptionBadgeProps) {
  let badgeStyle = '';
  let displayText = '';
  
  switch (tier) {
    case 'free':
      badgeStyle = 'bg-slate-200 text-slate-800 hover:bg-slate-200';
      displayText = 'Basic';
      break;
    case 'pro':
      badgeStyle = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      displayText = 'Pro';
      break;
    case 'premium':
      badgeStyle = 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      displayText = 'Premium';
      break;
    default:
      badgeStyle = 'bg-neutral-200 text-neutral-800 hover:bg-neutral-200';
      displayText = tier.charAt(0).toUpperCase() + tier.slice(1);
  }
  
  return (
    <Badge className={`${badgeStyle} ${className}`} variant="outline">
      {displayText}
    </Badge>
  );
}