import { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, UploadedFiles, ProcessedData, WeekRange, TechnicianKPIs } from '../types';
import { getCurrentWeekRange } from '../utils/dateHelpers';

// Initial state
const initialState: AppState = {
  uploadedFiles: {
    opportunities: null,
    lineItems: null,
    jobTimes: null,
    appointments: null
  },
  processedData: null,
  selectedWeek: getCurrentWeekRange(),
  technicianKPIs: [],
  isLoading: false,
  error: null
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_UPLOADED_FILES':
      return {
        ...state,
        uploadedFiles: { ...state.uploadedFiles, ...action.payload }
      };
    
    case 'SET_PROCESSED_DATA':
      return {
        ...state,
        processedData: action.payload,
        error: null
      };
    
    case 'SET_SELECTED_WEEK':
      return {
        ...state,
        selectedWeek: action.payload
      };
    
    case 'SET_TECHNICIAN_KPIS':
      return {
        ...state,
        technicianKPIs: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

// Action creators
export const appActions = {
  setUploadedFiles: (files: Partial<UploadedFiles>) => ({
    type: 'SET_UPLOADED_FILES' as const,
    payload: files
  }),
  
  setProcessedData: (data: ProcessedData) => ({
    type: 'SET_PROCESSED_DATA' as const,
    payload: data
  }),
  
  setSelectedWeek: (week: WeekRange) => ({
    type: 'SET_SELECTED_WEEK' as const,
    payload: week
  }),
  
  setTechnicianKPIs: (kpis: TechnicianKPIs[]) => ({
    type: 'SET_TECHNICIAN_KPIS' as const,
    payload: kpis
  }),
  
  setLoading: (loading: boolean) => ({
    type: 'SET_LOADING' as const,
    payload: loading
  }),
  
  setError: (error: string | null) => ({
    type: 'SET_ERROR' as const,
    payload: error
  }),
  
  resetState: () => ({
    type: 'RESET_STATE' as const
  })
}; 