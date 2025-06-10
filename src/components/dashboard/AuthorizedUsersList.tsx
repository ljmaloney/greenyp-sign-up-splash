
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Edit, Mail, Phone, User } from 'lucide-react';
import AddAuthorizedUserDialog from './AddAuthorizedUserDialog';

interface AuthorizedUser {
  id: string;
  firstName: string;
  lastName: string;
  businessPhone: string;
  cellPhone: string;
  emailAddress: string;
  userName: string;
}

const AuthorizedUsersList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Mock authorized users data
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      businessPhone: '(555) 123-4567',
      cellPhone: '(555) 123-4568',
      emailAddress: 'john@company.com',
      userName: 'jsmith'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      businessPhone: '(555) 234-5678',
      cellPhone: '(555) 234-5679',
      emailAddress: 'sarah@company.com',
      userName: 'sjohnson'
    }
  ]);

  const handleUserAdded = (newUserData: any) => {
    const newUser: AuthorizedUser = {
      id: Date.now().toString(),
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      businessPhone: newUserData.businessPhone,
      cellPhone: newUserData.cellPhone,
      emailAddress: newUserData.emailAddress,
      userName: newUserData.userName
    };
    setAuthorizedUsers(prev => [...prev, newUser]);
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

      <div className="grid gap-6">
        {authorizedUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-greenyp-600" />
                  {user.firstName} {user.lastName}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {/* Edit functionality can be added later */}}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Username: {user.userName}</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{user.emailAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>Business: {user.businessPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>Cell: {user.cellPhone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddAuthorizedUserDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default AuthorizedUsersList;
