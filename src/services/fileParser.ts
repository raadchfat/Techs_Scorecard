import * as XLSX from 'xlsx';
import { 
  OpportunitiesData, 
  LineItemsData, 
  JobTimesData, 
  AppointmentsData,
  ProcessedData 
} from '../types';
import { parseCurrency, parsePercentage } from '../utils/formatters';

/**
 * Parse Excel file and extract data from specified sheet
 */
export async function parseExcelFile<T>(file: File, sheetName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames.includes(sheetName)) {
          throw new Error(`Sheet "${sheetName}" not found in file`);
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          throw new Error('File contains insufficient data');
        }
        
        // Convert array of arrays to array of objects using first row as headers
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const result = rows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        resolve(result as T[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse Opportunities Report
 */
export async function parseOpportunitiesReport(file: File): Promise<OpportunitiesData[]> {
  const rawData = await parseExcelFile<any>(file, 'Opportunities');
  
  return rawData.map(row => ({
    Date: row.Date || '',
    Job: String(row.Job || ''),
    Customer: row.Customer || '',
    Email: row.Email || '',
    Phone: row.Phone || '',
    Status: row.Status || 'Pending',
    'Opportunity Owner': row['Opportunity Owner'] || '',
    'Membership Opportunity': row['Membership Opportunity'] || 'No',
    'Membership Sold': row['Membership Sold'] || 'No',
    Revenue: typeof row.Revenue === 'number' ? row.Revenue : parseFloat(row.Revenue) || 0
  }));
}

/**
 * Parse Line Items Sold Report
 */
export async function parseLineItemsReport(file: File): Promise<LineItemsData[]> {
  const rawData = await parseExcelFile<any>(file, 'Sold Line Items');
  
  return rawData.map(row => ({
    'Invoice Date': row['Invoice Date'] || '',
    Customer: row.Customer || '',
    Job: String(row.Job || ''),
    'Opp. Owner': row['Opp. Owner'] || '',
    Category: row.Category || '',
    'Line Item': row['Line Item'] || '',
    Quantity: typeof row.Quantity === 'number' ? row.Quantity : parseInt(row.Quantity) || 0,
    Price: typeof row.Price === 'number' ? row.Price : parseFloat(row.Price) || 0
  }));
}

/**
 * Parse Job Times Report
 */
export async function parseJobTimesReport(file: File): Promise<JobTimesData[]> {
  const rawData = await parseExcelFile<any>(file, 'Job Times');
  
  return rawData.map(row => ({
    'First Appointment': row['First Appointment'] || '',
    Job: String(row.Job || ''),
    'Job Status': row['Job Status'] || 'Pending',
    Customer: row.Customer || '',
    'Opportunity Owner': row['Opportunity Owner'] || '',
    Opportunity: row.Opportunity || 'Invalid',
    Total: row.Total || '$0',
    'Total Time': row['Total Time'] || '0h 0m (0 mins)',
    'Sold Time': row['Sold Time'] || '0h 0m (0 mins)',
    'Job Efficiency': row['Job Efficiency'] || '0 %'
  }));
}

/**
 * Parse Appointments Report
 */
export async function parseAppointmentsReport(file: File): Promise<AppointmentsData[]> {
  const rawData = await parseExcelFile<any>(file, 'Appointments');
  
  return rawData.map(row => ({
    Appointment: String(row.Appointment || ''),
    'Scheduled For': row['Scheduled For'] || '',
    Job: String(row.Job || ''),
    Customer: row.Customer || '',
    'Appt Status': row['Appt Status'] || 'Pending',
    Technician: row.Technician || '',
    'Service Category': row['Service Category'] || '',
    Revenue: typeof row.Revenue === 'number' ? row.Revenue : parseFloat(row.Revenue) || 0
  }));
}

/**
 * Parse all uploaded files
 */
export async function parseAllFiles(files: {
  opportunities: File | null;
  lineItems: File | null;
  jobTimes: File | null;
  appointments: File | null;
}): Promise<ProcessedData> {
  const results: ProcessedData = {
    opportunities: [],
    lineItems: [],
    jobTimes: [],
    appointments: []
  };

  try {
    if (files.opportunities) {
      results.opportunities = await parseOpportunitiesReport(files.opportunities);
    }
    
    if (files.lineItems) {
      results.lineItems = await parseLineItemsReport(files.lineItems);
    }
    
    if (files.jobTimes) {
      results.jobTimes = await parseJobTimesReport(files.jobTimes);
    }
    
    if (files.appointments) {
      results.appointments = await parseAppointmentsReport(files.appointments);
    }
    
    return results;
  } catch (error) {
    throw new Error(`Failed to parse files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate file type
 */
export function validateExcelFile(file: File): boolean {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  return validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
}

/**
 * Get file size in MB
 */
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
} 