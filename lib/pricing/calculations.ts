export interface PricingInputs {
  pricingModel: 'one_time' | 'subscription' | 'both'
  oneTimePrice?: number
  monthlyPrice?: number
  annualPrice?: number
  targetCustomers: number
  monthlyChurnRate: number
  conversionRate: number
  monthlyCosts: number
  customerAcquisitionCost: number
}

export interface PricingResults {
  oneTime: {
    totalRevenue: number
    netRevenue: number
    profitMargin: number
    breakEvenCustomers: number
  }
  subscription: {
    month1Revenue: number
    month6Revenue: number
    month12Revenue: number
    avgMonthlyRevenue: number
    customerLifetimeValue: number
    totalAnnualRevenue: number
    netAnnualRevenue: number
    profitMargin: number
    breakEvenCustomers: number
  }
}

export function calculatePricingMetrics(inputs: PricingInputs): PricingResults {
  const {
    pricingModel,
    oneTimePrice = 0,
    monthlyPrice = 0,
    annualPrice = 0,
    targetCustomers,
    monthlyChurnRate,
    conversionRate,
    monthlyCosts,
    customerAcquisitionCost,
  } = inputs

  // One-time pricing calculations
  const oneTimeRevenue = oneTimePrice * targetCustomers
  const oneTimeTotalCost = monthlyCosts * 12 + (customerAcquisitionCost * targetCustomers)
  const oneTimeNetRevenue = oneTimeRevenue - oneTimeTotalCost
  const oneTimeProfitMargin = oneTimeRevenue > 0 ? (oneTimeNetRevenue / oneTimeRevenue) * 100 : 0
  const oneTimeBreakEvenCustomers = oneTimePrice > customerAcquisitionCost
    ? Math.ceil(monthlyCosts * 12 / (oneTimePrice - customerAcquisitionCost))
    : 0

  // Subscription pricing calculations
  const churnRate = monthlyChurnRate / 100
  const effectiveMonthlyPrice = annualPrice > 0 ? annualPrice / 12 : monthlyPrice

  // Calculate revenue over 12 months with churn
  let activeCustomers = targetCustomers
  let month1Revenue = 0
  let month6Revenue = 0
  let month12Revenue = 0
  let totalRevenue = 0

  for (let month = 1; month <= 12; month++) {
    const monthRevenue = activeCustomers * effectiveMonthlyPrice
    totalRevenue += monthRevenue

    if (month === 1) month1Revenue = monthRevenue
    if (month === 6) month6Revenue = monthRevenue
    if (month === 12) month12Revenue = monthRevenue

    // Apply churn
    activeCustomers = activeCustomers * (1 - churnRate)
  }

  const avgMonthlyRevenue = totalRevenue / 12
  const avgCustomerLifespan = churnRate > 0 ? 1 / churnRate : 36 // Cap at 36 months
  const customerLTV = effectiveMonthlyPrice * avgCustomerLifespan

  const subscriptionTotalCost = monthlyCosts * 12 + (customerAcquisitionCost * targetCustomers)
  const subscriptionNetRevenue = totalRevenue - subscriptionTotalCost
  const subscriptionProfitMargin = totalRevenue > 0 ? (subscriptionNetRevenue / totalRevenue) * 100 : 0

  const subscriptionBreakEvenCustomers = effectiveMonthlyPrice > 0
    ? Math.ceil((monthlyCosts + customerAcquisitionCost) / effectiveMonthlyPrice)
    : 0

  return {
    oneTime: {
      totalRevenue: Math.round(oneTimeRevenue),
      netRevenue: Math.round(oneTimeNetRevenue),
      profitMargin: Math.round(oneTimeProfitMargin * 10) / 10,
      breakEvenCustomers: oneTimeBreakEvenCustomers,
    },
    subscription: {
      month1Revenue: Math.round(month1Revenue),
      month6Revenue: Math.round(month6Revenue),
      month12Revenue: Math.round(month12Revenue),
      avgMonthlyRevenue: Math.round(avgMonthlyRevenue),
      customerLifetimeValue: Math.round(customerLTV),
      totalAnnualRevenue: Math.round(totalRevenue),
      netAnnualRevenue: Math.round(subscriptionNetRevenue),
      profitMargin: Math.round(subscriptionProfitMargin * 10) / 10,
      breakEvenCustomers: subscriptionBreakEvenCustomers,
    },
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
