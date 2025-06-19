
import { Producer } from '@/services/accountService';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';

export interface BusinessData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
}

interface BusinessDataProcessorProps {
  producer: Producer;
  children: (data: { businessData: BusinessData; lineOfBusinessName: string }) => React.ReactNode;
}

const BusinessDataProcessor = ({ producer, children }: BusinessDataProcessorProps) => {
  const { data: lineOfBusinessData } = useLineOfBusiness();

  // Find the line of business name - using correct property name
  const lineOfBusinessName = lineOfBusinessData?.find(
    lob => lob.lineOfBusinessId === producer.lineOfBusinessId
  )?.lineOfBusinessName || 'Unknown';

  // Create businessData object for the edit dialog
  const businessData: BusinessData = {
    businessName: producer.businessName || '',
    contactName: '', // This would need to come from contacts
    email: '', // This would need to come from contacts
    phone: '', // This would need to come from contacts
    address: '', // This would need to come from primary location
    website: producer.websiteUrl || '',
    description: producer.narrative || '',
  };

  return <>{children({ businessData, lineOfBusinessName })}</>;
};

export default BusinessDataProcessor;
