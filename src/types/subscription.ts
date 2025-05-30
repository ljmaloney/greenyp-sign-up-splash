
export interface SubscriptionFeature {
  id: string;
  name: string;
  description?: string;
}

export interface APISubscription {
  subscriptionId: string;
  version: number;
  createDate: string;
  lastUpdateDate: string;
  displayName: string;
  endDate: string;
  lineOfBusinessId: string | null;
  monthlyAutopayAmount: number;
  quarterlyAutopayAmount: number;
  annualBillAmount: number;
  shortDescription: string;
  htmlDescription: string;
  startDate: string;
  subscriptionType: string;
  comingSoon: boolean;
  sortOrder: number;
  features: string[];
}

export interface SubscriptionWithFormatting extends APISubscription {
  formattedMonthlyPrice: string;
  formattedYearlyPrice?: string;
  formattedFeatures: SubscriptionFeature[];
  popular?: boolean;
}
