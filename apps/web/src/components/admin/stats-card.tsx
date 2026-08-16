'use client';

import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  subtext?: string;
}

export function StatsCard({ title, value, change, changeLabel = 'vs last period', icon: Icon, subtext }: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 bg-[#febd69]/15 rounded-md text-[#c7511f]">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-[#0f1111]">{value}</span>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center text-xs font-bold px-2 py-0.5 rounded-full',
              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            <span>{isPositive ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>

      {(subtext || changeLabel) && (
        <p className="text-xs text-gray-400">
          {subtext || changeLabel}
        </p>
      )}
    </div>
  );
}
