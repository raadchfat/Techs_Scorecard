import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import { TechnicianKPIs } from '../types';
import { KPIMetric } from './KPIMetric';
import { getKPIDisplayInfo } from '../services/kpiCalculator';

interface TechnicianCardProps {
  technicianKPI: TechnicianKPIs;
}

export function TechnicianCard({ technicianKPI }: TechnicianCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { technician, metrics } = technicianKPI;
  const displayInfo = getKPIDisplayInfo();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const kpiDescriptions = {
    averageTicketValue: 'Total revenue divided by number of completed jobs',
    jobCloseRate: 'Percentage of opportunities that resulted in won jobs',
    weeklyRevenue: 'Total revenue generated during the selected week',
    jobEfficiency: 'Average efficiency percentage across all jobs',
    membershipWinRate: 'Percentage of membership opportunities that were sold',
    hydroJettingJobs: 'Number of hydro jetting services sold',
    descalingJobs: 'Number of descaling services sold',
    waterHeaterJobs: 'Number of water heater services sold'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{technician}</h3>
              <p className="text-sm text-gray-500">
                {Object.keys(metrics).length} KPIs calculated
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPIMetric
              label={displayInfo.averageTicketValue.label}
              value={metrics.averageTicketValue}
              format={displayInfo.averageTicketValue.format}
              unit={displayInfo.averageTicketValue.unit}
              description={kpiDescriptions.averageTicketValue}
            />
            
            <KPIMetric
              label={displayInfo.jobCloseRate.label}
              value={metrics.jobCloseRate}
              format={displayInfo.jobCloseRate.format}
              unit={displayInfo.jobCloseRate.unit}
              description={kpiDescriptions.jobCloseRate}
            />
            
            <KPIMetric
              label={displayInfo.weeklyRevenue.label}
              value={metrics.weeklyRevenue}
              format={displayInfo.weeklyRevenue.format}
              unit={displayInfo.weeklyRevenue.unit}
              description={kpiDescriptions.weeklyRevenue}
            />
            
            <KPIMetric
              label={displayInfo.jobEfficiency.label}
              value={metrics.jobEfficiency}
              format={displayInfo.jobEfficiency.format}
              unit={displayInfo.jobEfficiency.unit}
              description={kpiDescriptions.jobEfficiency}
            />
            
            <KPIMetric
              label={displayInfo.membershipWinRate.label}
              value={metrics.membershipWinRate}
              format={displayInfo.membershipWinRate.format}
              unit={displayInfo.membershipWinRate.unit}
              description={kpiDescriptions.membershipWinRate}
            />
            
            <KPIMetric
              label={displayInfo.hydroJettingJobs.label}
              value={metrics.hydroJettingJobs}
              format={displayInfo.hydroJettingJobs.format}
              unit={displayInfo.hydroJettingJobs.unit}
              description={kpiDescriptions.hydroJettingJobs}
            />
            
            <KPIMetric
              label={displayInfo.descalingJobs.label}
              value={metrics.descalingJobs}
              format={displayInfo.descalingJobs.format}
              unit={displayInfo.descalingJobs.unit}
              description={kpiDescriptions.descalingJobs}
            />
            
            <KPIMetric
              label={displayInfo.waterHeaterJobs.label}
              value={metrics.waterHeaterJobs}
              format={displayInfo.waterHeaterJobs.format}
              unit={displayInfo.waterHeaterJobs.unit}
              description={kpiDescriptions.waterHeaterJobs}
            />
          </div>
        </div>
      )}
    </div>
  );
} 