// Excel file data types
export interface OpportunitiesData {
  Date: string;
  Job: string;
  Customer: string;
  Email: string;
  Phone: string;
  Status: 'Won' | 'Lost' | 'Pending';
  'Opportunity Owner': string;
  'Membership Opportunity': 'Yes' | 'No';
  'Membership Sold': 'Yes' | 'No';
  Revenue: number;
}

export interface LineItemsData {
  'Invoice Date': string;
  Customer: string;
  Job: string;
  'Opp. Owner': string;
  Category: string;
  'Line Item': string;
  Quantity: number;
  Price: number;
}

export interface JobTimesData {
  'First Appointment': string;
  Job: string;
  'Job Status': 'Pending' | 'Completed';
  Customer: string;
  'Opportunity Owner': string;
  Opportunity: 'Won' | 'Lost' | 'Invalid';
  Total: string; // "$105.93"
  'Total Time': string; // "4h 48m (288 mins)"
  'Sold Time': string; // "0h 0m (0 mins)"
  'Job Efficiency': string; // "60 %"
}

export interface AppointmentsData {
  Appointment: string;
  'Scheduled For': string;
  Job: string;
  Customer: string;
  'Appt Status': 'Cancelled' | 'Completed' | 'Pending';
  Technician: string;
  'Service Category': string;
  Revenue: number;
}

// Processed data types
export interface ProcessedData {
  opportunities: OpportunitiesData[];
  lineItems: LineItemsData[];
  jobTimes: JobTimesData[];
  appointments: AppointmentsData[];
}

export interface TechnicianData {
  name: string;
  normalizedName: string;
  opportunities: OpportunitiesData[];
  lineItems: LineItemsData[];
  jobTimes: JobTimesData[];
  appointments: AppointmentsData[];
}

// KPI types
export interface KPIMetrics {
  averageTicketValue: number;
  jobCloseRate: number;
  weeklyRevenue: number;
  jobEfficiency: number;
  membershipWinRate: number;
  hydroJettingJobs: number;
  descalingJobs: number;
  waterHeaterJobs: number;
}

export interface TechnicianKPIs {
  technician: string;
  metrics: KPIMetrics;
}

// File upload types
export interface UploadedFiles {
  opportunities: File | null;
  lineItems: File | null;
  jobTimes: File | null;
  appointments: File | null;
}

// Week selection types
export interface WeekRange {
  start: Date;
  end: Date;
}

// App state types
export interface AppState {
  uploadedFiles: UploadedFiles;
  processedData: ProcessedData | null;
  selectedWeek: WeekRange;
  technicianKPIs: TechnicianKPIs[];
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_UPLOADED_FILES'; payload: Partial<UploadedFiles> }
  | { type: 'SET_PROCESSED_DATA'; payload: ProcessedData }
  | { type: 'SET_SELECTED_WEEK'; payload: WeekRange }
  | { type: 'SET_TECHNICIAN_KPIS'; payload: TechnicianKPIs[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

// Service categories for filtering
export const SERVICE_CATEGORIES = {
  HYDRO_JETTING: ['hydro', 'jetting', 'high pressure'],
  DESCALING: ['descal', 'scale removal', 'cast iron pipe descaling'],
  WATER_HEATER: ['water heater', 'hot water', 'heater install']
} as const; 