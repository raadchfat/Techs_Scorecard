import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from typing import Dict, List, Optional, Tuple
import io

# Page configuration
st.set_page_config(
    page_title="Omaha Drain KPI Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
        margin: 0.5rem 0;
    }
    .success { border-left-color: #28a745; }
    .warning { border-left-color: #ffc107; }
    .danger { border-left-color: #dc3545; }
    .upload-section {
        background-color: #f8f9fa;
        padding: 2rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Data structures
@st.cache_data
def load_sample_data():
    """Load sample data for demonstration"""
    sample_opportunities = pd.DataFrame({
        'Date': pd.date_range('2024-01-01', periods=100, freq='D'),
        'Job': [f'JOB-{i:04d}' for i in range(1, 101)],
        'Customer': [f'Customer {i}' for i in range(1, 101)],
        'Status': np.random.choice(['Won', 'Lost', 'Open'], 100),
        'Opportunity Owner': np.random.choice(['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson'], 100),
        'Revenue': np.random.uniform(100, 2000, 100),
        'Membership': np.random.choice(['Yes', 'No'], 100)
    })
    
    sample_line_items = pd.DataFrame({
        'Invoice Date': pd.date_range('2024-01-01', periods=150, freq='D'),
        'Job': [f'JOB-{i:04d}' for i in range(1, 151)],
        'Opp. Owner': np.random.choice(['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson'], 150),
        'Line Item': np.random.choice(['Hydro Jetting', 'Descaling', 'Water Heater', 'Drain Cleaning'], 150),
        'Category': np.random.choice(['Service', 'Product'], 150),
        'Price': np.random.uniform(50, 500, 150)
    })
    
    sample_job_times = pd.DataFrame({
        'First Appointment': pd.date_range('2024-01-01', periods=80, freq='D'),
        'Job': [f'JOB-{i:04d}' for i in range(1, 81)],
        'Job Status': np.random.choice(['Completed', 'In Progress', 'Cancelled'], 80),
        'Opportunity Owner': np.random.choice(['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson'], 80),
        'Job Efficiency': np.random.uniform(60, 100, 80)
    })
    
    sample_appointments = pd.DataFrame({
        'Scheduled For': pd.date_range('2024-01-01', periods=120, freq='D'),
        'Job': [f'JOB-{i:04d}' for i in range(1, 121)],
        'Technician': np.random.choice(['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson'], 120),
        'Appt Status': np.random.choice(['Completed', 'No Show', 'Rescheduled'], 120),
        'Revenue': np.random.uniform(100, 1500, 120)
    })
    
    return sample_opportunities, sample_line_items, sample_job_times, sample_appointments

def parse_excel_file(uploaded_file) -> Optional[pd.DataFrame]:
    """Parse uploaded Excel file"""
    try:
        if uploaded_file is not None:
            # Read the Excel file
            df = pd.read_excel(uploaded_file, engine='openpyxl')
            st.success(f"✅ Successfully loaded {uploaded_file.name} with {len(df)} rows")
            return df
        return None
    except Exception as e:
        st.error(f"❌ Error loading {uploaded_file.name}: {str(e)}")
        return None

def calculate_kpis(opportunities_df, line_items_df, job_times_df, appointments_df, start_date, end_date):
    """Calculate KPIs for each technician"""
    
    # Filter data by date range
    opportunities_filtered = opportunities_df[
        (opportunities_df['Date'] >= start_date) & 
        (opportunities_df['Date'] <= end_date)
    ]
    
    line_items_filtered = line_items_df[
        (line_items_df['Invoice Date'] >= start_date) & 
        (line_items_df['Invoice Date'] <= end_date)
    ]
    
    job_times_filtered = job_times_df[
        (job_times_df['First Appointment'] >= start_date) & 
        (job_times_df['First Appointment'] <= end_date)
    ]
    
    appointments_filtered = appointments_df[
        (appointments_df['Scheduled For'] >= start_date) & 
        (appointments_df['Scheduled For'] <= end_date)
    ]
    
    # Get unique technicians
    technicians = set()
    if not opportunities_filtered.empty:
        technicians.update(opportunities_filtered['Opportunity Owner'].dropna().unique())
    if not line_items_filtered.empty:
        technicians.update(line_items_filtered['Opp. Owner'].dropna().unique())
    if not job_times_filtered.empty:
        technicians.update(job_times_filtered['Opportunity Owner'].dropna().unique())
    if not appointments_filtered.empty:
        technicians.update(appointments_filtered['Technician'].dropna().unique())
    
    kpi_results = {}
    
    for tech in technicians:
        if pd.isna(tech) or tech == '':
            continue
            
        # Filter data for this technician
        tech_opps = opportunities_filtered[opportunities_filtered['Opportunity Owner'] == tech]
        tech_line_items = line_items_filtered[line_items_filtered['Opp. Owner'] == tech]
        tech_job_times = job_times_filtered[job_times_filtered['Opportunity Owner'] == tech]
        tech_appointments = appointments_filtered[appointments_filtered['Technician'] == tech]
        
        # Calculate KPIs
        total_revenue = tech_opps['Revenue'].sum() + tech_appointments['Revenue'].sum()
        completed_jobs = len(tech_opps[tech_opps['Status'] == 'Won'])
        total_opportunities = len(tech_opps)
        
        # KPI 1: Average Ticket Value
        avg_ticket_value = total_revenue / max(completed_jobs, 1)
        
        # KPI 2: Job Close Rate
        job_close_rate = (completed_jobs / max(total_opportunities, 1)) * 100
        
        # KPI 3: Weekly Revenue
        weekly_revenue = total_revenue
        
        # KPI 4: Job Efficiency
        job_efficiency = tech_job_times['Job Efficiency'].mean() if not tech_job_times.empty else 0
        
        # KPI 5: Membership Win Rate
        membership_opps = tech_opps[tech_opps['Membership'] == 'Yes']
        membership_wins = len(membership_opps[membership_opps['Status'] == 'Won'])
        membership_win_rate = (membership_wins / max(len(membership_opps), 1)) * 100
        
        # KPI 6-8: Service-specific jobs
        hydro_jetting = len(tech_line_items[tech_line_items['Line Item'] == 'Hydro Jetting'])
        descaling = len(tech_line_items[tech_line_items['Line Item'] == 'Descaling'])
        water_heater = len(tech_line_items[tech_line_items['Line Item'] == 'Water Heater'])
        
        kpi_results[tech] = {
            'Average Ticket Value': round(avg_ticket_value, 2),
            'Job Close Rate': round(job_close_rate, 1),
            'Weekly Revenue': round(weekly_revenue, 2),
            'Job Efficiency': round(job_efficiency, 1),
            'Membership Win Rate': round(membership_win_rate, 1),
            'Hydro Jetting Jobs': hydro_jetting,
            'Descaling Jobs': descaling,
            'Water Heater Jobs': water_heater
        }
    
    return kpi_results

def get_performance_color(value, metric_type):
    """Get color based on performance"""
    if metric_type in ['Average Ticket Value', 'Weekly Revenue']:
        if value >= 1000: return 'success'
        elif value >= 500: return 'warning'
        else: return 'danger'
    elif metric_type in ['Job Close Rate', 'Job Efficiency', 'Membership Win Rate']:
        if value >= 80: return 'success'
        elif value >= 60: return 'warning'
        else: return 'danger'
    else:  # Count metrics
        if value >= 10: return 'success'
        elif value >= 5: return 'warning'
        else: return 'danger'

def main():
    st.markdown('<h1 class="main-header">📊 Omaha Drain Service Techs KPI Dashboard</h1>', unsafe_allow_html=True)
    
    # Sidebar for file uploads
    with st.sidebar:
        st.header("📁 File Upload")
        
        # File upload sections
        st.subheader("1. Opportunities Report")
        opportunities_file = st.file_uploader(
            "Upload OpportunitiesReport.xlsx",
            type=['xlsx', 'xls'],
            key="opportunities"
        )
        
        st.subheader("2. Line Items Report")
        line_items_file = st.file_uploader(
            "Upload LineItemsSoldReport.xlsx",
            type=['xlsx', 'xls'],
            key="line_items"
        )
        
        st.subheader("3. Job Times Report")
        job_times_file = st.file_uploader(
            "Upload JobTimesReport.xlsx",
            type=['xlsx', 'xls'],
            key="job_times"
        )
        
        st.subheader("4. Appointments Report")
        appointments_file = st.file_uploader(
            "Upload AppointmentsReport.xlsx",
            type=['xlsx', 'xls'],
            key="appointments"
        )
        
        # Demo mode toggle
        demo_mode = st.checkbox("🎮 Demo Mode (Use Sample Data)", value=True)
        
        if demo_mode:
            st.info("Demo mode enabled - using sample data")
    
    # Main content area
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("📅 Week Selection")
        
        # Week selector
        today = datetime.now()
        start_of_week = today - timedelta(days=today.weekday())
        end_of_week = start_of_week + timedelta(days=6)
        
        selected_start = st.date_input(
            "Start Date",
            value=start_of_week.date(),
            max_value=today.date()
        )
        
        selected_end = st.date_input(
            "End Date",
            value=end_of_week.date(),
            max_value=today.date()
        )
    
    with col2:
        st.header("⚙️ Actions")
        
        if st.button("🚀 Process Data", type="primary"):
            st.session_state.process_clicked = True
    
    # Data processing
    if st.button("🚀 Process Data", key="process_btn") or st.session_state.get('process_clicked', False):
        st.session_state.process_clicked = False
        
        with st.spinner("Processing data..."):
            if demo_mode:
                # Load sample data
                opportunities_df, line_items_df, job_times_df, appointments_df = load_sample_data()
                st.success("✅ Loaded sample data successfully")
            else:
                # Parse uploaded files
                opportunities_df = parse_excel_file(opportunities_file)
                line_items_df = parse_excel_file(line_items_file)
                job_times_df = parse_excel_file(job_times_file)
                appointments_df = parse_excel_file(appointments_file)
                
                if not all([opportunities_df is not None, line_items_df is not None, 
                           job_times_df is not None, appointments_df is not None]):
                    st.error("❌ Please upload all required files")
                    return
            
            # Calculate KPIs
            kpi_results = calculate_kpis(
                opportunities_df, line_items_df, job_times_df, appointments_df,
                selected_start, selected_end
            )
            
            if kpi_results:
                st.session_state.kpi_results = kpi_results
                st.session_state.week_range = f"{selected_start} to {selected_end}"
                st.success(f"✅ Processed data for {len(kpi_results)} technicians")
            else:
                st.warning("⚠️ No data found for the selected date range")
    
    # Display results
    if hasattr(st.session_state, 'kpi_results') and st.session_state.kpi_results:
        st.header(f"📊 KPI Results ({st.session_state.week_range})")
        
        # Summary metrics
        st.subheader("📈 Summary Dashboard")
        
        total_techs = len(st.session_state.kpi_results)
        total_revenue = sum(tech_data['Weekly Revenue'] for tech_data in st.session_state.kpi_results.values())
        avg_efficiency = np.mean([tech_data['Job Efficiency'] for tech_data in st.session_state.kpi_results.values()])
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("👥 Total Technicians", total_techs)
        
        with col2:
            st.metric("💰 Total Revenue", f"${total_revenue:,.2f}")
        
        with col3:
            st.metric("⚡ Avg Efficiency", f"{avg_efficiency:.1f}%")
        
        with col4:
            avg_ticket = total_revenue / max(sum(tech_data['Average Ticket Value'] for tech_data in st.session_state.kpi_results.values()), 1)
            st.metric("🎫 Avg Ticket Value", f"${avg_ticket:.2f}")
        
        # Individual technician cards
        st.subheader("👨‍🔧 Technician Performance")
        
        for tech_name, tech_data in st.session_state.kpi_results.items():
            with st.expander(f"🔧 {tech_name}", expanded=True):
                cols = st.columns(4)
                
                metrics = [
                    ('Average Ticket Value', f"${tech_data['Average Ticket Value']}"),
                    ('Job Close Rate', f"{tech_data['Job Close Rate']}%"),
                    ('Weekly Revenue', f"${tech_data['Weekly Revenue']}"),
                    ('Job Efficiency', f"{tech_data['Job Efficiency']}%"),
                    ('Membership Win Rate', f"{tech_data['Membership Win Rate']}%"),
                    ('Hydro Jetting Jobs', tech_data['Hydro Jetting Jobs']),
                    ('Descaling Jobs', tech_data['Descaling Jobs']),
                    ('Water Heater Jobs', tech_data['Water Heater Jobs'])
                ]
                
                for i, (metric_name, value) in enumerate(metrics):
                    with cols[i % 4]:
                        color_class = get_performance_color(tech_data[metric_name], metric_name)
                        st.markdown(f"""
                        <div class="metric-card {color_class}">
                            <strong>{metric_name}</strong><br>
                            <span style="font-size: 1.2em; color: #1f77b4;">{value}</span>
                        </div>
                        """, unsafe_allow_html=True)
        
        # Charts
        st.subheader("📊 Performance Charts")
        
        # Revenue comparison chart
        tech_names = list(st.session_state.kpi_results.keys())
        revenues = [st.session_state.kpi_results[tech]['Weekly Revenue'] for tech in tech_names]
        
        fig_revenue = px.bar(
            x=tech_names,
            y=revenues,
            title="Weekly Revenue by Technician",
            labels={'x': 'Technician', 'y': 'Revenue ($)'},
            color=revenues,
            color_continuous_scale='viridis'
        )
        st.plotly_chart(fig_revenue, use_container_width=True)
        
        # Efficiency comparison chart
        efficiencies = [st.session_state.kpi_results[tech]['Job Efficiency'] for tech in tech_names]
        
        fig_efficiency = px.bar(
            x=tech_names,
            y=efficiencies,
            title="Job Efficiency by Technician",
            labels={'x': 'Technician', 'y': 'Efficiency (%)'},
            color=efficiencies,
            color_continuous_scale='plasma'
        )
        st.plotly_chart(fig_efficiency, use_container_width=True)
        
        # Service breakdown chart
        services_data = []
        for tech in tech_names:
            services_data.extend([
                {'Technician': tech, 'Service': 'Hydro Jetting', 'Count': st.session_state.kpi_results[tech]['Hydro Jetting Jobs']},
                {'Technician': tech, 'Service': 'Descaling', 'Count': st.session_state.kpi_results[tech]['Descaling Jobs']},
                {'Technician': tech, 'Service': 'Water Heater', 'Count': st.session_state.kpi_results[tech]['Water Heater Jobs']}
            ])
        
        services_df = pd.DataFrame(services_data)
        fig_services = px.bar(
            services_df,
            x='Technician',
            y='Count',
            color='Service',
            title="Service Breakdown by Technician",
            barmode='group'
        )
        st.plotly_chart(fig_services, use_container_width=True)

if __name__ == "__main__":
    main()
