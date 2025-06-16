
export const getDisplayPrice = (subscription: any, billingPeriod: 'monthly' | 'yearly') => {
  if (subscription.comingSoon) {
    return "";
  }
  
  if (subscription.monthlyAutopayAmount === 0) {
    return "Free";
  }
  
  if (billingPeriod === 'yearly' && subscription.annualBillAmount) {
    return `$${subscription.annualBillAmount}`;
  }
  
  return subscription.formattedMonthlyPrice;
};

export const getDisplayPeriod = (subscription: any, billingPeriod: 'monthly' | 'yearly') => {
  if (subscription.comingSoon) {
    return "";
  }
  
  if (subscription.monthlyAutopayAmount === 0) {
    return "for first month";
  }
  
  if (billingPeriod === 'yearly' && subscription.annualBillAmount) {
    return "/year";
  }
  
  return "/month";
};

export const getSavingsText = (subscription: any, billingPeriod: 'monthly' | 'yearly') => {
  if (subscription.comingSoon) {
    return null;
  }
  
  if (billingPeriod === 'yearly' && subscription.annualBillAmount && subscription.monthlyAutopayAmount > 0) {
    const yearlyTotal = subscription.monthlyAutopayAmount * 12;
    const savings = yearlyTotal - subscription.annualBillAmount;
    const savingsPercent = Math.round((savings / yearlyTotal) * 100);
    return `Save ${savingsPercent}% with annual billing`;
  }
  return null;
};
