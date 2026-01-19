import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

interface CSVUploaderProps {
    onDataLoaded: (data: any[], headers: string[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const processFile = (file: File) => {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Please upload a valid CSV file.');
            return;
        }

        setFileName(file.name);
        setError(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    setError('Error parsing CSV file.');
                    console.error(results.errors);
                } else {
                    onDataLoaded(results.data, results.meta.fields || []);
                }
            },
            error: (err) => {
                setError('Failed to read file.');
                console.error(err);
            }
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragActive
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('csv-input')?.click()}
            >
                <input
                    id="csv-input"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleChange}
                />

                {fileName ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in-95">
                        <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle size={24} />
                        </div>
                        <p className="text-white font-medium">{fileName}</p>
                        <p className="text-white/40 text-xs mt-1">Click to replace</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragActive ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/60'}`}>
                            <Upload size={24} />
                        </div>
                        <p className="text-white font-medium mb-1">
                            {isDragActive ? 'Drop file here' : 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-white/40 text-xs">CSV files only (max 5MB)</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center space-x-2 mt-3 text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20 animate-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default CSVUploader;
