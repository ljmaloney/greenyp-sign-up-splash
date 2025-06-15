
import { getApiUrl } from '@/config/api';

export interface Contact {
  contactId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  producerContactType: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
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
    producerContactType: "PRIMARY",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California", 
    zipCode: "95123",
    country: "USA"
  },
  {
    contactId: "CONTACT-002",
    firstName: "Mike",
    lastName: "Chen",
    emailAddress: "mike@greenvalleyorganic.com",
    phoneNumber: "(555) 123-4568",
    producerContactType: "ADMIN",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California",
    zipCode: "95123", 
    country: "USA"
  },
  {
    contactId: "CONTACT-003",
    firstName: "Emma",
    lastName: "Davis",
    emailAddress: "emma@greenvalleyorganic.com",
    phoneNumber: "(555) 123-4569",
    producerContactType: "BILLING",
    streetAddress: "5678 Business Ave",
    city: "San Francisco",
    state: "California",
    zipCode: "94102",
    country: "USA"
  },
  {
    contactId: "CONTACT-004",
    firstName: "James",
    lastName: "Wilson",
    emailAddress: "james@greenvalleyorganic.com",
    phoneNumber: "(555) 123-4570",
    producerContactType: "TECHNICAL",
    streetAddress: "1234 Farm Road",
    city: "Greenville",
    state: "California",
    zipCode: "95123",
    country: "USA"
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
