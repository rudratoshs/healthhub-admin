// src/components/StatCard.tsx
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  trend = 'neutral',
  className,
}) => {
  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="rounded-md bg-primary-50 p-2 text-primary-600">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
      {change !== undefined && (
        <CardFooter className="p-2">
          <div
            className={`flex items-center space-x-1 text-xs font-medium ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight size={14} />
            ) : trend === 'down' ? (
              <ArrowDownRight size={14} />
            ) : null}
            <span>{change}%</span>
            <span>from last month</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default StatCard;