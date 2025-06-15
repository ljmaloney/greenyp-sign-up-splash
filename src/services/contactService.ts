
import { getApiUrl } from '@/config/api';

export interface Contact {
  contactId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  cellPhoneNumber?: string;
  producerContactType: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  title?: string;
  emailConfirmed?: boolean;
  genericContactName?: string;
  displayContactType?: string;
  producerLocationId?: string;
}

// Check if we're in prototyping mode
const isPrototyping = () => 
  window.location.hostname.includes('lovable') || 
  window.location.hostname === 'localhost';

// Dummy data for prototyping
const getDummyContacts = (): Contact[] => [
  {
    contactId: "CONTACT-001",
    firstName: "Sarah",
    lastName: "Johnson",
    emailAddress: "sarah@greenvalleyorganic.com",
    phoneNumber: "(555) 123-4567",
    cellPhoneNumber: "(555) 123-4567",
    producerContactType: "PRIMARY",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California", 
    zipCode: "95123",
    country: "USA",
    title: "Farm Manager",
    emailConfirmed: true,
    genericContactName: "Sarah Johnson",
    displayContactType: "Primary Contact",
    producerLocationId: "LOC-001"
  },
  {
    contactId: "CONTACT-002",
    firstName: "Mike",
    lastName: "Chen",
    emailAddress: "mike@greenvalleyorganic.com",
    phoneNumber: "(555) 123-4568",
    cellPhoneNumber: "(555) 123-4568",
    producerContactType: "ADMIN",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California",
    zipCode: "95123", 
    country: "USA",
    title: "Operations Manager",
    emailConfirmed: true,
    genericContactName: "Mike Chen",
    displayContactType: "Admin Contact",
    producerLocationId: "LOC-001"
  },
  {
    contactId: "CONTACT-003",
    firstName: "Emma",
    lastName: "Davis",
    emailAddress: "emma@greenvalleyorganic.com",
    phoneNumber: "(555) 123-4569",
    cellPhoneNumber: "(555) 123-4569",
    producerContactType: "SALES",
    streetAddress: "5678 Business Ave",
    city: "San Francisco",
    state: "California",
    zipCode: "94102",
    country: "USA",
    title: "Sales Director",
    emailConfirmed: false,
    genericContactName: "Emma Davis",
    displayContactType: "Sales Contact",
    producerLocationId: "LOC-002"
  },
  {
    contactId: "CONTACT-004",
    firstName: "James",
    lastName: "Wilson",
    emailAddress: "james@greenvalleyorganic.com",
    phoneNumber: "(555) 123-4570",
    cellPhoneNumber: "(555) 123-4570",
    producerContactType: "ACCOUNTS_PAYABLE",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California",
    zipCode: "95123",
    country: "USA",
    title: "Accountant",
    emailConfirmed: true,
    genericContactName: "James Wilson",
    displayContactType: "Billing Contact",
    producerLocationId: "LOC-001"
  }
];

export const fetchContacts = async (producerId: string): Promise<Contact[]> => {
  // Return dummy data in prototyping mode
  if (isPrototyping()) {
    console.log('🔧 Using dummy contacts data for prototyping');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return getDummyContacts();
  }

  const response = await fetch(getApiUrl(`/producer/${producerId}/contacts`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.status}`);
  }
  
  return response.json();
};
