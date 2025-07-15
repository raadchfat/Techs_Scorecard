import React from 'react';
import { Info } from 'lucide-react';
import { formatCurrency, formatPercentage, formatCount, getKPIColorClass, getKPIBgColorClass } from '../utils/formatters';
import { getKPIThresholds } from '../services/kpiCalculator';

interface KPIMetricProps {
  label: string;
  value: number;
  format: 'currency' | 'percentage' | 'count';
  unit?: string;
  description?: string;
}

export function KPIMetric({ label, value, format, unit, description }: KPIMetricProps) {
  const thresholds = getKPIThresholds();
  const metricKey = Object.keys(thresholds).find(key => 
    key.toLowerCase().includes(label.toLowerCase().replace(/\s+/g, ''))
  ) as keyof typeof thresholds;
  
  const threshold = metricKey ? thresholds[metricKey] : { good: 0, warning: 0 };
  
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'count':
        return formatCount(value);
      default:
        return value.toString();
    }
  };

  const colorClass = getKPIColorClass(value, threshold);
  const bgColorClass = getKPIBgColorClass(value, threshold);

  return (
    <div className={`p-4 rounded-lg border ${bgColorClass}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-gray-900">{label}</h3>
            {description && (
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
          <p className={`text-2xl font-bold ${colorClass} mt-1`}>
            {formatValue()}
          </p>
          {unit && (
            <p className="text-xs text-gray-500 mt-1">{unit}</p>
          )}
        </div>
      </div>
    </div>
  );
} 