
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Mail, User, Clock, Shield, ShieldCheck } from 'lucide-react';
import { useAuthorizedUsers } from '@/hooks/useAuthorizedUsers';
import { AuthorizedUserResponse } from '@/services/authorizedUsersService';
import AddAuthorizedUserDialog from './AddAuthorizedUserDialog';
import EditAuthorizedUserDialog from './EditAuthorizedUserDialog';

const AuthorizedUsersList = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Use producerId from URL params, or fallback to user ID for prototyping
  const producerId = searchParams.get('producerId') || user?.id;
  
  const { data: authorizedUsers, isLoading, error, refetch } = useAuthorizedUsers(producerId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AuthorizedUserResponse | null>(null);

  console.log('📱 AuthorizedUsersList - producerId:', producerId);
  console.log('📱 AuthorizedUsersList - users data:', authorizedUsers);
  console.log('📱 AuthorizedUsersList - loading:', isLoading);
  console.log('📱 AuthorizedUsersList - error:', error);

  const handleUserAdded = () => {
    refetch();
  };

  const handleUserUpdated = () => {
    refetch();
  };

  const handleEditUser = (user: AuthorizedUserResponse) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Authorized Users</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Authorized Users</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Error loading authorized users</p>
              <p className="text-sm text-gray-600">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!producerId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Authorized Users</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-600">Producer ID is required to load authorized users</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Authorized Users</h1>
        <Button 
          className="bg-greenyp-600 hover:bg-greenyp-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {!authorizedUsers || authorizedUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No authorized users found</h3>
              <p className="text-gray-600">Get started by adding your first authorized user.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {authorizedUsers.map((user) => (
            <Card key={user.credentialsId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-greenyp-600" />
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <Badge variant={user.enabled ? 'default' : 'secondary'}>
                        {user.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      {user.adminUser && (
                        <Badge variant="outline" className="text-amber-600 border-amber-200">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-gray-600 font-medium">Username: {user.userName}</p>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{user.emailAddress}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Created: {formatDate(user.createDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Last Updated: {formatDate(user.lastUpdateDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>External Service Ref: {user.externalAuthorizationServiceRef}</p>
                    <p>Producer Contact ID: {user.producerContactId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddAuthorizedUserDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onUserAdded={handleUserAdded}
      />

      {selectedUser && (
        <EditAuthorizedUserDialog
          isOpen={isEditDialogOpen}
          onClose={handleCloseEditDialog}
          user={selectedUser as any}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default AuthorizedUsersList;
