import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users, DumbbellIcon, Utensils } from 'lucide-react';
import { StatTrendValue } from '@/components/ui/stat-card-types';

const Dashboard: React.FC = () => {
  // Convert the trend objects to the required string format
  const convertTrend = (trend: StatTrendValue): 'up' | 'down' | 'neutral' => {
    if (trend.value === 0) return 'neutral';
    return trend.positive ? 'up' : 'down';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your FitLife admin dashboard
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Users"
              value="2,543"
              trend={convertTrend({ value: 12.5, positive: true })}
              icon={<Users className="h-5 w-5" />}
              description="12.5% from last month"
            />
            
            <StatCard 
              title="Active Plans"
              value="345"
              trend={convertTrend({ value: 8.2, positive: true })}
              icon={<Utensils className="h-5 w-5" />}
              description="8.2% from last month"
            />
            
            <StatCard 
              title="Completed Workouts"
              value="1,284"
              trend={convertTrend({ value: 3.1, positive: false })}
              icon={<DumbbellIcon className="h-5 w-5" />}
              description="3.1% decrease from last month"
            />
            
            <StatCard 
              title="Active Sessions"
              value="42"
              trend="neutral"
              icon={<Activity className="h-5 w-5" />}
              description="Same as last month"
            />
          </div>
          
          
        </TabsContent>
        
        <TabsContent value="analytics">
          
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
