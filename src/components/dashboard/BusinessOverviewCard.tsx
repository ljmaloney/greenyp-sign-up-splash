
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Calendar, Building, Globe } from 'lucide-react';
import { Producer } from '@/services/accountService';
import { useLineOfBusiness } from '@/hooks/useLineOfBusiness';
import EditBusinessInfoDialog from './EditBusinessInfoDialog';

interface BusinessOverviewCardProps {
  producer: Producer;
}

const BusinessOverviewCard = ({ producer }: BusinessOverviewCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNarrativeExpanded, setIsNarrativeExpanded] = useState(false);
  const { data: lineOfBusinessData, isLoading: lobLoading } = useLineOfBusiness();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLineOfBusinessName = (lineOfBusinessId: string) => {
    console.log('🔍 Looking for lineOfBusinessId:', lineOfBusinessId);
    console.log('📊 Available line of business data:', lineOfBusinessData);
    
    if (!lineOfBusinessData || !lineOfBusinessId) {
      console.log('❌ No line of business data or ID available');
      return lobLoading ? 'Loading...' : 'Not specified';
    }
    
    const lob = lineOfBusinessData.find(item => item.lineOfBusinessId === lineOfBusinessId);
    console.log('✅ Found line of business:', lob);
    
    return lob?.lineOfBusinessName || 'Unknown';
  };

  const shouldTruncateNarrative = producer.narrative && producer.narrative.length > 150;
  const displayedNarrative = shouldTruncateNarrative && !isNarrativeExpanded 
    ? producer.narrative.substring(0, 150) + '...'
    : producer.narrative;

  const businessData = {
    businessName: producer.businessName,
    contactName: '', // This would need to come from contacts
    description: producer.narrative,
    websiteUrl: producer.websiteUrl,
    producerId: producer.producerId,
    lineOfBusinessId: producer.lineOfBusinessId,
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl text-greenyp-600">{producer.businessName}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              {producer.narrative && (
                <div className="text-gray-600 mt-2">
                  <p>{displayedNarrative}</p>
                  {shouldTruncateNarrative && (
                    <button
                      onClick={() => setIsNarrativeExpanded(!isNarrativeExpanded)}
                      className="text-greenyp-600 hover:text-greenyp-700 text-sm mt-1"
                    >
                      {isNarrativeExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
            </div>
            <Badge variant={producer.subscriptionType === 'LIVE_UNPAID' ? 'destructive' : 'default'}>
              {producer.subscriptionType.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Website:</span>
                <span className="text-gray-900">
                  {producer.websiteUrl || 'Not provided'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Line of Business:</span>
                <span className="text-gray-900">
                  {getLineOfBusinessName(producer.lineOfBusinessId)}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Profile Created:</span>
                <span className="text-gray-900">
                  {formatDate(producer.createDate)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">
                  {formatDate(producer.lastUpdateDate)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditBusinessInfoDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        businessData={businessData}
      />
    </>
  );
};

export default BusinessOverviewCard;
