
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Calendar } from 'lucide-react';

// Mock data for subscriber statistics
const subscriberStats = {
  past5Days: 12,
  past14Days: 28,
  past30Days: 47
};

const SubscriberStatsCards = () => {
  const stats = [
    {
      title: 'New Subscribers (5 days)',
      value: subscriberStats.past5Days,
      icon: Users,
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'New Subscribers (14 days)',
      value: subscriberStats.past14Days,
      icon: Calendar,
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'New Subscribers (30 days)',
      value: subscriberStats.past30Days,
      icon: TrendingUp,
      trend: '+18.9%',
      trendUp: true
    }
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              {stat.trend} from previous period
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default SubscriberStatsCards;
