# Sample Data for Testing

This document provides guidance on creating sample Excel files for testing the Omaha Drain KPI Dashboard.

## File Structure Requirements

### 1. OpportunitiesReport.xlsx
**Sheet Name**: "Opportunities"

| Column | Type | Example | Required |
|--------|------|---------|----------|
| Date | MM/DD/YYYY | 07/10/2025 | Yes |
| Job | String | 8099724 | Yes |
| Customer | String | "Georgianna Chen" | Yes |
| Email | String | "sgpengch@gmail.com" | No |
| Phone | String | "(402) 598-2357" | No |
| Status | Enum | "Won", "Lost", "Pending" | Yes |
| Opportunity Owner | String | "Brennan Ebbesmier" | Yes |
| Membership Opportunity | Enum | "Yes", "No" | Yes |
| Membership Sold | Enum | "Yes", "No" | Yes |
| Revenue | Number | 15128 | Yes |

### 2. LineItemsSoldReport.xlsx
**Sheet Name**: "Sold Line Items"

| Column | Type | Example | Required |
|--------|------|---------|----------|
| Invoice Date | MM/DD/YYYY | 06/30/2025 | Yes |
| Customer | String | "Felisa Matthews" | Yes |
| Job | String | 8487195 | Yes |
| Opp. Owner | String | "Colin Myers" | Yes |
| Category | String | "Clogged Drain" | Yes |
| Line Item | String | "$93 Drain Clearing Special" | Yes |
| Quantity | Number | 1 | Yes |
| Price | Number | 93 | Yes |

### 3. JobTimesReport.xlsx
**Sheet Name**: "Job Times"

| Column | Type | Example | Required |
|--------|------|---------|----------|
| First Appointment | MM/DD/YYYY | 06/18/2025 | Yes |
| Job | String | 8426355 | Yes |
| Job Status | Enum | "Pending", "Completed" | Yes |
| Customer | String | "Caroline Dundis" | Yes |
| Opportunity Owner | String | "Brennan Ebbesmier" | Yes |
| Opportunity | Enum | "Won", "Lost", "Invalid" | Yes |
| Total | String | "$105.93" | Yes |
| Total Time | String | "4h 48m (288 mins)" | Yes |
| Sold Time | String | "0h 0m (0 mins)" | Yes |
| Job Efficiency | String | "60 %" | Yes |

### 4. AppointmentsReport.xlsx
**Sheet Name**: "Appointments"

| Column | Type | Example | Required |
|--------|------|---------|----------|
| Appointment | String | 8599177 | Yes |
| Scheduled For | MM/DD/YYYY HH:MM AM/PM | 06/01/2025 10:00 AM | Yes |
| Job | String | 8289665 | Yes |
| Customer | String | "NEST - Cameron Siler" | Yes |
| Appt Status | Enum | "Cancelled", "Completed", "Pending" | Yes |
| Technician | String | "Justice Burns" | Yes |
| Service Category | String | "Main Drain Blockage" | Yes |
| Revenue | Number | 1218 | Yes |

## Sample Data for Testing

### Sample Opportunities Data
```
Date,Job,Customer,Email,Phone,Status,Opportunity Owner,Membership Opportunity,Membership Sold,Revenue
07/10/2025,8099724,Georgianna Chen,sgpengch@gmail.com,(402) 598-2357,Won,Brennan Ebbesmier,Yes,Yes,15128
07/11/2025,8099725,John Smith,john@email.com,(402) 123-4567,Lost,Steven Springer,No,No,0
07/12/2025,8099726,Jane Doe,jane@email.com,(402) 234-5678,Pending,Aaron McDaniel,Yes,No,5000
```

### Sample Line Items Data
```
Invoice Date,Customer,Job,Opp. Owner,Category,Line Item,Quantity,Price
06/30/2025,Felisa Matthews,8487195,Colin Myers,Clogged Drain,$93 Drain Clearing Special,1,93
06/30/2025,John Smith,8487196,Brennan Ebbesmier,Water Heater,40 Gallon Gas Water Heater Give Away,1,1200
06/30/2025,Jane Doe,8487197,Steven Springer,Descaling,Cast Iron Pipe Descaling - Additional Service Per FT,1,250
```

### Sample Job Times Data
```
First Appointment,Job,Job Status,Customer,Opportunity Owner,Opportunity,Total,Total Time,Sold Time,Job Efficiency
06/18/2025,8426355,Completed,Caroline Dundis,Brennan Ebbesmier,Won,$105.93,4h 48m (288 mins),2h 30m (150 mins),60 %
06/19/2025,8426356,Pending,John Smith,Steven Springer,Pending,$250.00,2h 0m (120 mins),0h 0m (0 mins),0 %
```

### Sample Appointments Data
```
Appointment,Scheduled For,Job,Customer,Appt Status,Technician,Service Category,Revenue
8599177,06/01/2025 10:00 AM,8289665,NEST - Cameron Siler,Completed,Justice Burns,Main Drain Blockage,1218
8599178,06/02/2025 02:00 PM,8289666,ABC Company,Cancelled,Aaron McDaniel,Plumbing Estimate,0
```

## Important Notes

1. **Job ID Consistency**: Use the same Job IDs across different files to test data integration
2. **Date Ranges**: Use dates within the same week to test week-based filtering
3. **Technician Names**: Use consistent technician names across files
4. **Service Categories**: Include keywords for hydro jetting, descaling, and water heater services

## Testing Scenarios

### Scenario 1: Basic Functionality
- Upload all 4 files with minimal data
- Verify parsing and KPI calculation
- Test week filtering

### Scenario 2: Data Integration
- Use overlapping Job IDs across files
- Verify technician name normalization
- Test revenue calculation accuracy

### Scenario 3: Error Handling
- Upload files with missing columns
- Test invalid date formats
- Verify error messages

### Scenario 4: Performance
- Upload larger datasets (100+ records per file)
- Test processing time
- Verify memory usage

## Creating Excel Files

1. **Using Excel/Google Sheets**:
   - Create new spreadsheet
   - Add headers in first row
   - Add sample data
   - Save as .xlsx format

2. **Using CSV Import**:
   - Create CSV files with sample data
   - Import into Excel
   - Save as .xlsx format

3. **Using Online Tools**:
   - Use online Excel generators
   - Copy sample data
   - Download as .xlsx

## Validation Checklist

Before testing, ensure:
- [ ] All required sheets exist with correct names
- [ ] All required columns are present
- [ ] Data types match expected formats
- [ ] Job IDs are consistent across files
- [ ] Dates are within testable range
- [ ] Technician names are consistent
- [ ] File sizes are under 10MB 