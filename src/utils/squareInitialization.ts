
// Mock Square initialization since we removed Square integration
export const initializeSquarePayments = async (): Promise<void> => {
  console.log('Mock Square SDK initialization...');
  // Simulate async initialization
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('Mock Square initialized successfully');
};

export const createSquareCard = async (cardElementId: string): Promise<any> => {
  console.log('Mock initializeCard called with elementId:', cardElementId);
  
  // Mock card instance
  const mockCardInstance = {
    attach: async (selector: string) => {
      console.log('Mock card attached to:', selector);
    },
    destroy: () => {
      console.log('Mock card instance destroyed');
    }
  };
  
  console.log('Mock card instance created');
  return mockCardInstance;
};
