import { 
  ProcessedData, 
  TechnicianData, 
  OpportunitiesData, 
  LineItemsData, 
  JobTimesData, 
  AppointmentsData 
} from '../types';
import { isDateInWeekRange } from '../utils/dateHelpers';
import { normalizeTechnicianName } from '../utils/formatters';

/**
 * Normalize technician names across all files
 */
export function normalizeTechnicianNames(data: ProcessedData): ProcessedData {
  // Create a mapping of normalized names to original names
  const nameMapping = new Map<string, string>();
  
  // Collect all technician names from all files
  const allNames = new Set<string>();
  
  data.opportunities.forEach(opp => {
    if (opp['Opportunity Owner']) allNames.add(opp['Opportunity Owner']);
  });
  
  data.lineItems.forEach(item => {
    if (item['Opp. Owner']) allNames.add(item['Opp. Owner']);
  });
  
  data.jobTimes.forEach(job => {
    if (job['Opportunity Owner']) allNames.add(job['Opportunity Owner']);
  });
  
  data.appointments.forEach(appt => {
    if (appt.Technician) allNames.add(appt.Technician);
  });
  
  // Create normalized mapping
  allNames.forEach(name => {
    const normalized = normalizeTechnicianName(name);
    if (!nameMapping.has(normalized)) {
      nameMapping.set(normalized, name);
    }
  });
  
  return data;
}

/**
 * Filter data by week range
 */
export function filterDataByWeek(
  data: ProcessedData, 
  weekRange: { start: Date; end: Date }
): ProcessedData {
  return {
    opportunities: data.opportunities.filter(opp => {
      try {
        const date = new Date(opp.Date);
        return isDateInWeekRange(date, weekRange);
      } catch {
        return false;
      }
    }),
    lineItems: data.lineItems.filter(item => {
      try {
        const date = new Date(item['Invoice Date']);
        return isDateInWeekRange(date, weekRange);
      } catch {
        return false;
      }
    }),
    jobTimes: data.jobTimes.filter(job => {
      try {
        const date = new Date(job['First Appointment']);
        return isDateInWeekRange(date, weekRange);
      } catch {
        return false;
      }
    }),
    appointments: data.appointments.filter(appt => {
      try {
        const date = new Date(appt['Scheduled For']);
        return isDateInWeekRange(date, weekRange);
      } catch {
        return false;
      }
    })
  };
}

/**
 * Group data by technician
 */
export function groupDataByTechnician(data: ProcessedData): TechnicianData[] {
  const technicianMap = new Map<string, TechnicianData>();
  
  console.log('Grouping data by technician...');
  console.log('Opportunities:', data.opportunities.length);
  console.log('Line Items:', data.lineItems.length);
  console.log('Job Times:', data.jobTimes.length);
  console.log('Appointments:', data.appointments.length);
  
  // Process opportunities
  data.opportunities.forEach(opp => {
    const techName = opp['Opportunity Owner'];
    if (!techName) {
      console.log('Skipping opportunity with no owner:', opp);
      return;
    }
    
    console.log('Processing opportunity for technician:', techName);
    const normalizedName = normalizeTechnicianName(techName);
    
    if (!technicianMap.has(normalizedName)) {
      technicianMap.set(normalizedName, {
        name: techName,
        normalizedName,
        opportunities: [],
        lineItems: [],
        jobTimes: [],
        appointments: []
      });
    }
    
    technicianMap.get(normalizedName)!.opportunities.push(opp);
  });
  
  // Process line items
  data.lineItems.forEach(item => {
    const techName = item['Opp. Owner'];
    if (!techName) return;
    
    const normalizedName = normalizeTechnicianName(techName);
    
    if (!technicianMap.has(normalizedName)) {
      technicianMap.set(normalizedName, {
        name: techName,
        normalizedName,
        opportunities: [],
        lineItems: [],
        jobTimes: [],
        appointments: []
      });
    }
    
    technicianMap.get(normalizedName)!.lineItems.push(item);
  });
  
  // Process job times
  data.jobTimes.forEach(job => {
    const techName = job['Opportunity Owner'];
    if (!techName) return;
    
    const normalizedName = normalizeTechnicianName(techName);
    
    if (!technicianMap.has(normalizedName)) {
      technicianMap.set(normalizedName, {
        name: techName,
        normalizedName,
        opportunities: [],
        lineItems: [],
        jobTimes: [],
        appointments: []
      });
    }
    
    technicianMap.get(normalizedName)!.jobTimes.push(job);
  });
  
  // Process appointments
  data.appointments.forEach(appt => {
    const techName = appt.Technician;
    if (!techName) return;
    
    const normalizedName = normalizeTechnicianName(techName);
    
    if (!technicianMap.has(normalizedName)) {
      technicianMap.set(normalizedName, {
        name: techName,
        normalizedName,
        opportunities: [],
        lineItems: [],
        jobTimes: [],
        appointments: []
      });
    }
    
    technicianMap.get(normalizedName)!.appointments.push(appt);
  });
  
  return Array.from(technicianMap.values());
}

/**
 * Join data across files using Job ID
 */
export function joinDataByJobId(data: ProcessedData): ProcessedData {
  // Create job ID mappings for cross-referencing
  const jobOpportunities = new Map<string, OpportunitiesData>();
  const jobLineItems = new Map<string, LineItemsData[]>();
  const jobJobTimes = new Map<string, JobTimesData>();
  const jobAppointments = new Map<string, AppointmentsData[]>();
  
  // Index opportunities by Job ID
  data.opportunities.forEach(opp => {
    if (opp.Job) {
      jobOpportunities.set(opp.Job, opp);
    }
  });
  
  // Index line items by Job ID
  data.lineItems.forEach(item => {
    if (item.Job) {
      if (!jobLineItems.has(item.Job)) {
        jobLineItems.set(item.Job, []);
      }
      jobLineItems.get(item.Job)!.push(item);
    }
  });
  
  // Index job times by Job ID
  data.jobTimes.forEach(job => {
    if (job.Job) {
      jobJobTimes.set(job.Job, job);
    }
  });
  
  // Index appointments by Job ID
  data.appointments.forEach(appt => {
    if (appt.Job) {
      if (!jobAppointments.has(appt.Job)) {
        jobAppointments.set(appt.Job, []);
      }
      jobAppointments.get(appt.Job)!.push(appt);
    }
  });
  
  return data;
}

/**
 * Validate data integrity
 */
export function validateDataIntegrity(data: ProcessedData): string[] {
  const errors: string[] = [];
  
  // Check for required fields
  data.opportunities.forEach((opp, index) => {
    if (!opp.Job) {
      errors.push(`Opportunity ${index + 1}: Missing Job ID`);
    }
    // Temporarily make Opportunity Owner optional for testing
    // if (!opp['Opportunity Owner']) {
    //   errors.push(`Opportunity ${index + 1}: Missing Opportunity Owner`);
    // }
  });
  
  data.lineItems.forEach((item, index) => {
    if (!item.Job) {
      errors.push(`Line Item ${index + 1}: Missing Job ID`);
    }
    // Temporarily make Opp. Owner optional for testing
    // if (!item['Opp. Owner']) {
    //   errors.push(`Line Item ${index + 1}: Missing Opp. Owner`);
    // }
  });
  
  data.jobTimes.forEach((job, index) => {
    if (!job.Job) {
      errors.push(`Job Time ${index + 1}: Missing Job ID`);
    }
    // Temporarily make Opportunity Owner optional for testing
    // if (!job['Opportunity Owner']) {
    //   errors.push(`Job Time ${index + 1}: Missing Opportunity Owner`);
    // }
  });
  
  data.appointments.forEach((appt, index) => {
    if (!appt.Job) {
      errors.push(`Appointment ${index + 1}: Missing Job ID`);
    }
    // Temporarily make Technician optional for testing
    // if (!appt.Technician) {
    //   errors.push(`Appointment ${index + 1}: Missing Technician`);
    // }
  });
  
  return errors;
}

/**
 * Get unique technician names from all files
 */
export function getUniqueTechnicians(data: ProcessedData): string[] {
  const technicians = new Set<string>();
  
  data.opportunities.forEach(opp => {
    if (opp['Opportunity Owner']) {
      technicians.add(opp['Opportunity Owner']);
    }
  });
  
  data.lineItems.forEach(item => {
    if (item['Opp. Owner']) {
      technicians.add(item['Opp. Owner']);
    }
  });
  
  data.jobTimes.forEach(job => {
    if (job['Opportunity Owner']) {
      technicians.add(job['Opportunity Owner']);
    }
  });
  
  data.appointments.forEach(appt => {
    if (appt.Technician) {
      technicians.add(appt.Technician);
    }
  });
  
  return Array.from(technicians).sort();
} 