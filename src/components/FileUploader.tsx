import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateExcelFile, getFileSizeMB } from '../services/fileParser';
import { useAppState, appActions } from '../hooks/useAppState';

interface FileUploadZoneProps {
  title: string;
  description: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  accept: string;
}

function FileUploadZone({ title, description, file, onFileSelect, accept }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    
    if (!validateExcelFile(selectedFile)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }
    
    const fileSizeMB = getFileSizeMB(selectedFile);
    if (fileSizeMB > 10) {
      setError('File size must be less than 10MB');
      return;
    }
    
    onFileSelect(selectedFile);
  }, [onFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback(() => {
    onFileSelect(null);
    setError(null);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragOver 
            ? 'border-primary-500 bg-primary-50' 
            : file 
              ? 'border-success-500 bg-success-50' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          {file ? (
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-6 h-6 text-success-600" />
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-gray-600"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Drag and drop or click to select
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 flex items-center space-x-2 text-danger-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export function FileUploader() {
  const { state, dispatch } = useAppState();

  const handleFileSelect = useCallback((fileType: keyof typeof state.uploadedFiles, file: File | null) => {
    dispatch(appActions.setUploadedFiles({ [fileType]: file }));
  }, [dispatch]);

  const uploadZones = [
    {
      key: 'opportunities' as const,
      title: 'Opportunities Report',
      description: 'Upload OpportunitiesReport.xlsx with sales opportunities data',
      accept: '.xlsx,.xls'
    },
    {
      key: 'lineItems' as const,
      title: 'Line Items Sold Report',
      description: 'Upload LineItemsSoldReport.xlsx with detailed service breakdowns',
      accept: '.xlsx,.xls'
    },
    {
      key: 'jobTimes' as const,
      title: 'Job Times Report',
      description: 'Upload JobTimesReport.xlsx with time efficiency data',
      accept: '.xlsx,.xls'
    },
    {
      key: 'appointments' as const,
      title: 'Appointments Report',
      description: 'Upload AppointmentsReport.xlsx with scheduling data',
      accept: '.xlsx,.xls'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Excel Files
        </h2>
        <p className="text-gray-600">
          Upload the four required Excel files to generate KPI reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uploadZones.map((zone) => (
          <FileUploadZone
            key={zone.key}
            title={zone.title}
            description={zone.description}
            file={state.uploadedFiles[zone.key]}
            onFileSelect={(file) => handleFileSelect(zone.key, file)}
            accept={zone.accept}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
        <div className="text-sm text-gray-500">
          <FileText className="inline w-4 h-4 mr-1" />
          All files must be in Excel format (.xlsx or .xls) and under 10MB
        </div>
      </div>
    </div>
  );
} 