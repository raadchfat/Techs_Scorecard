import { TechnicianData, KPIMetrics, SERVICE_CATEGORIES } from '../types';
import { parseCurrency, parsePercentage, matchesServiceCategory } from '../utils/formatters';

/**
 * Calculate Average Ticket Value
 * Formula: Total Revenue ÷ Number of Completed Jobs
 */
function calculateAverageTicketValue(technician: TechnicianData): number {
  const completedJobs = technician.opportunities.filter(opp => 
    opp.Status === 'Won'
  );
  
  if (completedJobs.length === 0) return 0;
  
  const totalRevenue = completedJobs.reduce((sum, opp) => sum + opp.Revenue, 0);
  return totalRevenue / completedJobs.length;
}

/**
 * Calculate Job Close Rate
 * Formula: (Jobs Won ÷ Total Opportunities) × 100
 */
function calculateJobCloseRate(technician: TechnicianData): number {
  const totalOpportunities = technician.opportunities.length;
  if (totalOpportunities === 0) return 0;
  
  const wonJobs = technician.opportunities.filter(opp => opp.Status === 'Won').length;
  return (wonJobs / totalOpportunities) * 100;
}

/**
 * Calculate Weekly Revenue
 * Formula: Sum of all revenue for technician
 */
function calculateWeeklyRevenue(technician: TechnicianData): number {
  const opportunitiesRevenue = technician.opportunities.reduce((sum, opp) => sum + opp.Revenue, 0);
  const appointmentsRevenue = technician.appointments.reduce((sum, appt) => sum + appt.Revenue, 0);
  
  // Note: This might double-count some revenue if the same job appears in both files
  // In a real scenario, you'd want to deduplicate based on Job ID
  return opportunitiesRevenue + appointmentsRevenue;
}

/**
 * Calculate Job Efficiency
 * Formula: Average of individual job efficiency percentages
 */
function calculateJobEfficiency(technician: TechnicianData): number {
  const validEfficiencies = technician.jobTimes
    .map(job => parsePercentage(job['Job Efficiency']))
    .filter(efficiency => efficiency > 0); // Filter out 0% and invalid values
  
  if (validEfficiencies.length === 0) return 0;
  
  const totalEfficiency = validEfficiencies.reduce((sum, efficiency) => sum + efficiency, 0);
  return totalEfficiency / validEfficiencies.length;
}

/**
 * Calculate Membership Win Rate
 * Formula: (Memberships Sold ÷ Membership Opportunities) × 100
 */
function calculateMembershipWinRate(technician: TechnicianData): number {
  const membershipOpportunities = technician.opportunities.filter(opp => 
    opp['Membership Opportunity'] === 'Yes'
  );
  
  if (membershipOpportunities.length === 0) return 0;
  
  const membershipsSold = membershipOpportunities.filter(opp => 
    opp['Membership Sold'] === 'Yes'
  ).length;
  
  return (membershipsSold / membershipOpportunities.length) * 100;
}

/**
 * Calculate Hydro Jetting Jobs Sold
 * Formula: Count of line items containing hydro jetting services
 */
function calculateHydroJettingJobs(technician: TechnicianData): number {
  return technician.lineItems.filter(item => 
    matchesServiceCategory(item['Line Item'], SERVICE_CATEGORIES.HYDRO_JETTING)
  ).length;
}

/**
 * Calculate Descaling Jobs Sold
 * Formula: Count of line items containing descaling services
 */
function calculateDescalingJobs(technician: TechnicianData): number {
  return technician.lineItems.filter(item => 
    matchesServiceCategory(item['Line Item'], SERVICE_CATEGORIES.DESCALING)
  ).length;
}

/**
 * Calculate Water Heater Jobs Sold
 * Formula: Count of line items containing water heater services
 */
function calculateWaterHeaterJobs(technician: TechnicianData): number {
  return technician.lineItems.filter(item => 
    matchesServiceCategory(item['Line Item'], SERVICE_CATEGORIES.WATER_HEATER)
  ).length;
}

/**
 * Calculate all KPIs for a technician
 */
export function calculateTechnicianKPIs(technician: TechnicianData): KPIMetrics {
  return {
    averageTicketValue: calculateAverageTicketValue(technician),
    jobCloseRate: calculateJobCloseRate(technician),
    weeklyRevenue: calculateWeeklyRevenue(technician),
    jobEfficiency: calculateJobEfficiency(technician),
    membershipWinRate: calculateMembershipWinRate(technician),
    hydroJettingJobs: calculateHydroJettingJobs(technician),
    descalingJobs: calculateDescalingJobs(technician),
    waterHeaterJobs: calculateWaterHeaterJobs(technician)
  };
}

/**
 * Calculate KPIs for all technicians
 */
export function calculateAllTechnicianKPIs(technicians: TechnicianData[]): Array<{ technician: string; metrics: KPIMetrics }> {
  return technicians.map(tech => ({
    technician: tech.name,
    metrics: calculateTechnicianKPIs(tech)
  }));
}

/**
 * Get KPI thresholds for color coding
 */
export function getKPIThresholds(): Record<keyof KPIMetrics, { good: number; warning: number }> {
  return {
    averageTicketValue: { good: 1000, warning: 500 },
    jobCloseRate: { good: 80, warning: 60 },
    weeklyRevenue: { good: 10000, warning: 5000 },
    jobEfficiency: { good: 75, warning: 50 },
    membershipWinRate: { good: 50, warning: 25 },
    hydroJettingJobs: { good: 5, warning: 2 },
    descalingJobs: { good: 3, warning: 1 },
    waterHeaterJobs: { good: 2, warning: 1 }
  };
}

/**
 * Get KPI display information
 */
export function getKPIDisplayInfo() {
  return {
    averageTicketValue: {
      label: 'Average Ticket Value',
      format: 'currency',
      unit: '$'
    },
    jobCloseRate: {
      label: 'Job Close Rate',
      format: 'percentage',
      unit: '%'
    },
    weeklyRevenue: {
      label: 'Weekly Revenue',
      format: 'currency',
      unit: '$'
    },
    jobEfficiency: {
      label: 'Job Efficiency',
      format: 'percentage',
      unit: '%'
    },
    membershipWinRate: {
      label: 'Membership Win Rate',
      format: 'percentage',
      unit: '%'
    },
    hydroJettingJobs: {
      label: 'Hydro Jetting Jobs',
      format: 'count',
      unit: 'jobs'
    },
    descalingJobs: {
      label: 'Descaling Jobs',
      format: 'count',
      unit: 'jobs'
    },
    waterHeaterJobs: {
      label: 'Water Heater Jobs',
      format: 'count',
      unit: 'jobs'
    }
  } as const;
} 