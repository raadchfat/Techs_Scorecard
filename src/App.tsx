import React, { useCallback, useEffect } from 'react';
import { Play, RefreshCw, AlertCircle, BarChart3 } from 'lucide-react';
import { AppProvider, useAppState, appActions } from './hooks/useAppState.tsx';
import { FileUploader } from './components/FileUploader';
import { WeekSelector } from './components/WeekSelector';
import { TechnicianCard } from './components/TechnicianCard';
import { parseAllFiles } from './services/fileParser';
import { filterDataByWeek, groupDataByTechnician, validateDataIntegrity } from './services/dataIntegrator';
import { calculateAllTechnicianKPIs } from './services/kpiCalculator';

function DashboardContent() {
  const { state, dispatch } = useAppState();

  const processFiles = useCallback(async () => {
    if (!state.uploadedFiles.opportunities || 
        !state.uploadedFiles.lineItems || 
        !state.uploadedFiles.jobTimes || 
        !state.uploadedFiles.appointments) {
      dispatch(appActions.setError('Please upload all four Excel files'));
      return;
    }

    try {
      dispatch(appActions.setLoading(true));
      dispatch(appActions.setError(null));

      // Parse all files
      const processedData = await parseAllFiles(state.uploadedFiles);
      
      // Validate data integrity
      const validationErrors = validateDataIntegrity(processedData);
      if (validationErrors.length > 0) {
        dispatch(appActions.setError(`Data validation errors: ${validationErrors.slice(0, 3).join(', ')}`));
        return;
      }

      // Store processed data
      dispatch(appActions.setProcessedData(processedData));

      // Filter data by selected week
      const filteredData = filterDataByWeek(processedData, state.selectedWeek);
      
      // Group data by technician
      const technicians = groupDataByTechnician(filteredData);
      
      console.log('Filtered data:', filteredData);
      console.log('Technicians found:', technicians.length);
      console.log('Technician names:', technicians.map(t => t.name));
      
      // Calculate KPIs
      const technicianKPIs = calculateAllTechnicianKPIs(technicians);
      
      console.log('Calculated KPIs:', technicianKPIs);
      
      dispatch(appActions.setTechnicianKPIs(technicianKPIs));
      dispatch(appActions.setLoading(false));
    } catch (error) {
      dispatch(appActions.setError(error instanceof Error ? error.message : 'Failed to process files'));
      dispatch(appActions.setLoading(false));
    }
  }, [state.uploadedFiles, state.selectedWeek, dispatch]);

  // Reprocess when week changes
  useEffect(() => {
    if (state.processedData && state.technicianKPIs.length > 0) {
      const filteredData = filterDataByWeek(state.processedData, state.selectedWeek);
      const technicians = groupDataByTechnician(filteredData);
      const technicianKPIs = calculateAllTechnicianKPIs(technicians);
      dispatch(appActions.setTechnicianKPIs(technicianKPIs));
    }
  }, [state.selectedWeek, state.processedData, dispatch]);

  const allFilesUploaded = state.uploadedFiles.opportunities && 
                          state.uploadedFiles.lineItems && 
                          state.uploadedFiles.jobTimes && 
                          state.uploadedFiles.appointments;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Omaha Drain KPI Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Service Technicians Performance Metrics
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <WeekSelector />
              
              {allFilesUploaded && (
                <button
                  onClick={processFiles}
                  disabled={state.isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {state.isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>{state.isLoading ? 'Processing...' : 'Process Files'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {state.error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-danger-600" />
              <span className="text-danger-800 font-medium">Error</span>
            </div>
            <p className="text-danger-700 mt-1">{state.error}</p>
          </div>
        )}

        {/* File Upload Section */}
        {!state.processedData && (
          <div className="card">
            <FileUploader />
          </div>
        )}

        {/* Dashboard Section */}
        {state.processedData && state.technicianKPIs.length > 0 && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Weekly Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {state.technicianKPIs.length}
                  </p>
                  <p className="text-sm text-gray-500">Technicians</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success-600">
                    {state.technicianKPIs.reduce((sum, tech) => sum + tech.metrics.weeklyRevenue, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-600">
                    {(state.technicianKPIs.reduce((sum, tech) => sum + tech.metrics.jobCloseRate, 0) / state.technicianKPIs.length).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Avg Close Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-info-600">
                    {state.technicianKPIs.reduce((sum, tech) => sum + tech.metrics.hydroJettingJobs + tech.metrics.descalingJobs + tech.metrics.waterHeaterJobs, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Service Jobs</p>
                </div>
              </div>
            </div>

            {/* Technician Cards */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Technician Performance
              </h2>
              {state.technicianKPIs.map((technicianKPI) => (
                <TechnicianCard
                  key={technicianKPI.technician}
                  technicianKPI={technicianKPI}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {state.isLoading && (
          <div className="card text-center">
            <RefreshCw className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing Excel files...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
} 