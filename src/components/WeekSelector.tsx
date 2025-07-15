import React, { useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppState, appActions } from '../hooks/useAppState';
import { formatDateRange, getStartOfWeek, getEndOfWeek } from '../utils/dateHelpers';

export function WeekSelector() {
  const { state, dispatch } = useAppState();

  const handleWeekChange = useCallback((direction: 'prev' | 'next' | 'current') => {
    let newStart: Date;
    
    switch (direction) {
      case 'prev':
        newStart = new Date(state.selectedWeek.start);
        newStart.setDate(newStart.getDate() - 7);
        break;
      case 'next':
        newStart = new Date(state.selectedWeek.start);
        newStart.setDate(newStart.getDate() + 7);
        break;
      case 'current':
        newStart = new Date();
        break;
      default:
        return;
    }
    
    const newWeek = {
      start: getStartOfWeek(newStart),
      end: getEndOfWeek(newStart)
    };
    
    dispatch(appActions.setSelectedWeek(newWeek));
  }, [state.selectedWeek, dispatch]);

  const handleDateInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const newWeek = {
      start: getStartOfWeek(selectedDate),
      end: getEndOfWeek(selectedDate)
    };
    
    dispatch(appActions.setSelectedWeek(newWeek));
  }, [dispatch]);

  return (
    <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Week:</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleWeekChange('prev')}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
          aria-label="Previous week"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={state.selectedWeek.start.toISOString().split('T')[0]}
            onChange={handleDateInputChange}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">to</span>
          <span className="text-sm font-medium text-gray-900">
            {state.selectedWeek.end.toLocaleDateString()}
          </span>
        </div>
        
        <button
          onClick={() => handleWeekChange('next')}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
          aria-label="Next week"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <button
        onClick={() => handleWeekChange('current')}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        type="button"
      >
        Current Week
      </button>
      
      <div className="text-sm text-gray-500">
        {formatDateRange(state.selectedWeek.start, state.selectedWeek.end)}
      </div>
    </div>
  );
} 