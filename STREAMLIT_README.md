# Omaha Drain KPI Dashboard - Streamlit Version

This is a Streamlit version of the Omaha Drain Service Technicians KPI Dashboard, designed for deployment on Streamlit Cloud.

## Features

- **Excel File Processing**: Upload and process 4 different Excel file types
- **KPI Calculations**: Compute 8 key performance indicators per technician
- **Interactive Dashboard**: Real-time data visualization with Plotly charts
- **Week-based Filtering**: Filter data by selected date ranges
- **Demo Mode**: Test with sample data without uploading files
- **Responsive Design**: Works on desktop, tablet, and mobile

## KPI Metrics

1. **Average Ticket Value** - Total revenue ÷ Number of completed jobs
2. **Job Close Rate** - (Jobs Won ÷ Total Opportunities) × 100
3. **Weekly Revenue** - Sum of all revenue for technician
4. **Job Efficiency** - Average of individual job efficiency percentages
5. **Membership Win Rate** - (Memberships Sold ÷ Membership Opportunities) × 100
6. **Hydro Jetting Jobs Sold** - Count of hydro jetting services
7. **Descaling Jobs Sold** - Count of descaling services
8. **Water Heater Jobs Sold** - Count of water heater services

## Required Excel Files

### 1. OpportunitiesReport.xlsx
- **Sheet**: "Opportunities"
- **Purpose**: Sales opportunities and outcomes
- **Key Fields**: Date, Job, Customer, Status, Opportunity Owner, Revenue, Membership data

### 2. LineItemsSoldReport.xlsx
- **Sheet**: "Sold Line Items"
- **Purpose**: Detailed service/product breakdowns
- **Key Fields**: Invoice Date, Job, Opp. Owner, Line Item, Category, Price

### 3. JobTimesReport.xlsx
- **Sheet**: "Job Times"
- **Purpose**: Time efficiency and job completion metrics
- **Key Fields**: First Appointment, Job, Job Status, Opportunity Owner, Job Efficiency

### 4. AppointmentsReport.xlsx
- **Sheet**: "Appointments"
- **Purpose**: Appointment scheduling and completion tracking
- **Key Fields**: Scheduled For, Job, Technician, Appt Status, Revenue

## Local Development

### Prerequisites
- Python 3.8+
- pip

### Setup
1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**:
   ```bash
   streamlit run streamlit_app.py
   ```

3. **Open in browser**:
   - Navigate to `http://localhost:8501`
   - The application will automatically open in your default browser

## Streamlit Cloud Deployment

### Automatic Deployment
1. **Push to GitHub**: This repository is ready for Streamlit Cloud
2. **Connect to Streamlit Cloud**: 
   - Go to [share.streamlit.io](https://share.streamlit.io)
   - Sign in with GitHub
   - Select this repository
   - Deploy

### Manual Deployment
1. **Create requirements.txt**: Already included
2. **Create streamlit_app.py**: Main application file
3. **Configure .streamlit/config.toml**: Already included
4. **Deploy to Streamlit Cloud**

## Usage

### 1. Upload Excel Files
- Use the sidebar to upload all four required Excel files
- Each file has a specific upload zone with validation
- Files must be in Excel format (.xlsx or .xls)

### 2. Select Week Range
- Use the date inputs to choose the analysis period
- Default is current week (Monday to Sunday)

### 3. Process Data
- Click "Process Data" button to analyze the uploaded data
- The system will validate data integrity and calculate KPIs

### 4. View Results
- **Summary Dashboard**: Overview of all technicians and key metrics
- **Individual Technician Cards**: Expandable cards showing all 8 KPIs
- **Performance Charts**: Interactive visualizations of the data
- **Color-coded Performance**: Green (good), Yellow (average), Red (needs improvement)

## Demo Mode

Enable "Demo Mode" in the sidebar to test the application with sample data without uploading any files. This is perfect for:
- Testing the interface
- Demonstrating functionality
- Training purposes

## Data Processing Pipeline

1. **File Validation**: Check file format and required sheets
2. **Excel Parsing**: Extract data using pandas and openpyxl
3. **Data Cleaning**: Normalize dates, parse currency/percentages
4. **Data Integration**: Join datasets using Job ID relationships
5. **Week Filtering**: Filter data to selected date range
6. **Technician Grouping**: Group data by technician name
7. **KPI Calculation**: Compute all 8 metrics per technician
8. **Results Display**: Present data in interactive dashboard format

## Error Handling

The application provides comprehensive error handling for:
- **File Upload Errors**: Invalid format, missing sheets
- **Data Validation Errors**: Missing required fields, invalid data types
- **Processing Errors**: Parsing failures, calculation errors
- **User Feedback**: Clear error messages with suggestions for resolution

## Performance Optimization

- **Caching**: Parsed data cached to avoid re-processing
- **Efficient Data Processing**: Optimized pandas operations
- **Responsive Charts**: Interactive Plotly visualizations
- **Memory Management**: Efficient data handling for large files

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

1. **Files not uploading**
   - Ensure files are in Excel format (.xlsx or .xls)
   - Check file size is reasonable
   - Verify browser supports file upload

2. **Processing errors**
   - Check Excel files have required sheet names
   - Ensure required columns are present
   - Verify data format matches expected structure

3. **Performance issues**
   - Large files may take longer to process
   - Consider splitting very large datasets
   - Check browser memory usage

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.

## License

This project is proprietary software developed for Omaha Drain. All rights reserved.
