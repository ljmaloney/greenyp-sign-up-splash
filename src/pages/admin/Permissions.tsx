
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, Settings, Lock } from 'lucide-react';

const Permissions = () => {
  const permissionGroups = [
    {
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: ['Read', 'Write', 'Delete', 'Admin'],
      color: 'destructive'
    },
    {
      name: 'Admin',
      description: 'Administrative access with limited permissions',
      userCount: 5,
      permissions: ['Read', 'Write', 'Admin'],
      color: 'default'
    },
    {
      name: 'Moderator',
      description: 'Content moderation and user management',
      userCount: 12,
      permissions: ['Read', 'Write'],
      color: 'secondary'
    },
    {
      name: 'Viewer',
      description: 'Read-only access to system data',
      userCount: 8,
      permissions: ['Read'],
      color: 'outline'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permissions Management</h1>
            <p className="text-muted-foreground">
              Manage user roles and access permissions across the system.
            </p>
          </div>
          <Button>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {permissionGroups.map((group) => (
            <Card key={group.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {group.name}
                  </CardTitle>
                  <Badge variant={group.color as any}>
                    {group.userCount} users
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.permissions.map((permission) => (
                        <Badge key={permission} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Role
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <p className="text-sm text-muted-foreground">
              Overview of all permissions across different system modules.
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Module</th>
                    <th className="text-center p-4">Super Admin</th>
                    <th className="text-center p-4">Admin</th>
                    <th className="text-center p-4">Moderator</th>
                    <th className="text-center p-4">Viewer</th>
                  </tr>
                </thead>
                <tbody>
                  {['Users', 'Subscribers', 'Invoices', 'Analytics', 'Settings'].map((module) => (
                    <tr key={module} className="border-b">
                      <td className="p-4 font-medium">{module}</td>
                      <td className="text-center p-4">
                        <Badge variant="destructive">Full</Badge>
                      </td>
                      <td className="text-center p-4">
                        <Badge variant="default">Read/Write</Badge>
                      </td>
                      <td className="text-center p-4">
                        <Badge variant="secondary">Read</Badge>
                      </td>
                      <td className="text-center p-4">
                        <Badge variant="outline">Read</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Permissions;
