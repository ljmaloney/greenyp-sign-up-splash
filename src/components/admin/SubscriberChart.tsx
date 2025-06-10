
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Mock data for subscriber growth chart
const chartData = [
  { date: '2024-05-10', subscribers: 125 },
  { date: '2024-05-15', subscribers: 132 },
  { date: '2024-05-20', subscribers: 145 },
  { date: '2024-05-25', subscribers: 158 },
  { date: '2024-05-30', subscribers: 168 },
  { date: '2024-06-05', subscribers: 172 },
  { date: '2024-06-10', subscribers: 185 }
];

const chartConfig = {
  subscribers: {
    label: 'Subscribers',
    color: 'hsl(var(--primary))'
  }
};

const SubscriberChart = () => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Subscriber Growth</CardTitle>
        <CardDescription>
          New subscriber registrations over the past 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={chartData}>
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            />
            <Area
              type="monotone"
              dataKey="subscribers"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SubscriberChart;
