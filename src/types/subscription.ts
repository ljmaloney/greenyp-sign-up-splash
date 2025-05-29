
export interface SubscriptionFeature {
  id: string;
  name: string;
  description?: string;
}

export interface APISubscription {
  subscriptionId: string;
  displayName: string;
  shortDescription: string;
  monthlyAutopayAmount: number;
  yearlyAutopayAmount?: number;
  features: SubscriptionFeature[];
  comingSoon: boolean;
  popular?: boolean;
}

export interface SubscriptionWithFormatting extends APISubscription {
  formattedMonthlyPrice: string;
  formattedYearlyPrice?: string;
}
