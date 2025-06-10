
export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'secondary';
    case 'Pending':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'destructive';
    case 'Business Owner':
      return 'default';
    case 'Subscriber':
      return 'secondary';
    default:
      return 'secondary';
  }
};
