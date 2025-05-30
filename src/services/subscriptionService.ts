
import { APISubscription, SubscriptionWithFormatting } from '../types/subscription';
import { APIResponse } from '../types/responseBody';
import { API_CONFIG, getApiUrl } from '../config/api';

// Fetch subscriptions from the real API
export const fetchSubscriptions = async (): Promise<SubscriptionWithFormatting[]> => {
  try {
    console.log('Fetching subscriptions from API...');
    const url = getApiUrl('/reference/subscription');
    console.log('Subscription API URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: APIResponse<APISubscription[]> = await response.json();
    console.log('Subscription API response:', data);
    
    // Access the response data from the generic container
    const subscriptions = data.response;
    
    return formatSubscriptionData(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    // Fall back to mock data if the API fails
    return mockSubscriptionsResponse();
  }
};

// Format subscription data for display
export const formatSubscriptionData = (subscriptions: APISubscription[]): SubscriptionWithFormatting[] => {
  const formatted = subscriptions.map((subscription, index) => ({
    ...subscription,
    formattedMonthlyPrice: subscription.comingSoon ? '' : 
      subscription.monthlyAutopayAmount === 0 ? '$0' : `$${subscription.monthlyAutopayAmount}`,
    formattedYearlyPrice: subscription.comingSoon ? undefined :
      subscription.annualBillAmount ? `$${subscription.annualBillAmount}` : undefined,
    formattedFeatures: subscription.features.map((feature, featureIndex) => ({
      id: `${subscription.subscriptionId}-feature-${featureIndex}`,
      name: feature
    })),
    popular: index === 1 && !subscription.comingSoon // Mark the second subscription as popular if not coming soon
  }));
  
  console.log('Formatted subscription data:', formatted);
  return formatted;
};

// Mock data for development and fallback
export const mockSubscriptionsResponse = (): SubscriptionWithFormatting[] => {
  const mockData: APISubscription[] = [
    {
      subscriptionId: "basic-listing-001",
      version: 0,
      createDate: "2025-05-29T17:40:15Z",
      lastUpdateDate: "2025-05-29T17:40:15Z",
      displayName: "Basic Listing",
      endDate: "9999-12-31",
      lineOfBusinessId: null,
      monthlyAutopayAmount: 5,
      quarterlyAutopayAmount: 15,
      annualBillAmount: 60,
      shortDescription: "Perfect for small local landscaping or gardening businesses",
      htmlDescription: "",
      startDate: "2025-04-30",
      subscriptionType: "TOP_LEVEL",
      comingSoon: false,
      sortOrder: 0,
      features: [
        "Business Hours",
        "Basic business listing",
        "Single category listing",
        "Map Location",
        "Contact Information"
      ]
    },
    {
      subscriptionId: "featured-business-001",
      version: 0,
      createDate: "2025-05-29T19:15:18Z",
      lastUpdateDate: "2025-05-29T19:15:18Z",
      displayName: "Featured Business Listing",
      endDate: "9999-12-31",
      lineOfBusinessId: null,
      monthlyAutopayAmount: 29.99,
      quarterlyAutopayAmount: 89.99,
      annualBillAmount: 359,
      shortDescription: "Ideal for established landscaping and garden businesses",
      htmlDescription: "",
      startDate: "2025-04-30",
      subscriptionType: "TOP_LEVEL",
      comingSoon: false,
      sortOrder: 1,
      features: [
        "Multiple Location Listings (up to 5)",
        "Enhanced business profile",
        "Photo gallery (up to 15 images)",
        "Priority placement in searches"
      ]
    },
    {
      subscriptionId: "premium-enterprise-001",
      version: 0,
      createDate: "2025-05-29T20:00:00Z",
      lastUpdateDate: "2025-05-29T20:00:00Z",
      displayName: "Premium Enterprise",
      endDate: "9999-12-31",
      lineOfBusinessId: null,
      monthlyAutopayAmount: 99.99,
      quarterlyAutopayAmount: 299.99,
      annualBillAmount: 1199,
      shortDescription: "For large landscaping companies and franchises",
      htmlDescription: "",
      startDate: "2025-04-30",
      subscriptionType: "TOP_LEVEL",
      comingSoon: true,
      sortOrder: 2,
      features: [
        "Unlimited Location Listings",
        "Advanced analytics dashboard",
        "Custom branding options",
        "Priority customer support",
        "API access for integrations"
      ]
    }
  ];

  console.log('Using mock subscription data with coming soon plan');
  return formatSubscriptionData(mockData);
};
