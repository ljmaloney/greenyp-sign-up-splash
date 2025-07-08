
import { initializeSquare, getSquarePayments } from '@/config/square';

export const initializeSquarePayments = async (): Promise<void> => {
  console.log('Loading Square SDK...');
  await initializeSquare();
  console.log('Square initialized successfully');
};

export const createSquareCard = async (cardElementId: string): Promise<any> => {
  console.log('initializeCard called with elementId:', cardElementId);
  
  const payments = getSquarePayments();
  if (!payments) {
    console.error('Square payments not initialized');
    throw new Error('Square payments not initialized');
  }
  
  console.log('Creating card instance...');
  const cardInstance = await payments.card();
  console.log('Card instance created, attaching to element:', cardElementId);
  
  // Wait a bit for the DOM element to be ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  await cardInstance.attach(`#${cardElementId}`);
  console.log('Card attached successfully');
  
  return cardInstance;
};
