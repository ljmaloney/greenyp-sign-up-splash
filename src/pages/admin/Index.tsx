
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, BarChart, TrendingUp } from 'lucide-react';

const AdminIndex = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,547',
      description: '+180 from last month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Businesses',
      value: '1,234',
      description: '+12% from last month',
      icon: Building2,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: '$45,231',
      description: '+20% from last month',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Active Sessions',
      value: '573',
      description: 'Currently online',
      icon: BarChart,
      color: 'text-orange-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to the admin panel. Monitor and manage your platform from here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions performed on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New business registered</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User subscription updated</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment processed</p>
                    <p className="text-xs text-gray-500">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <p className="font-medium">Manage Users</p>
                  <p className="text-sm text-gray-500">View and edit user accounts</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <p className="font-medium">Review Businesses</p>
                  <p className="text-sm text-gray-500">Approve pending business listings</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <p className="font-medium">System Settings</p>
                  <p className="text-sm text-gray-500">Configure platform settings</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminIndex;
