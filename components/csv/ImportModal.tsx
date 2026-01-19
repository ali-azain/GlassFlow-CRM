import React, { useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import CSVUploader from './CSVUploader';
import CSVHeaderMapper from './CSVHeaderMapper';
import { supabase } from '../../lib/supabaseClient';

interface ImportModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState<'upload' | 'map' | 'importing'>('upload');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [progress, setProgress] = useState(0);

    const handleDataLoaded = (data: any[], headers: string[]) => {
        setCsvData(data);
        setHeaders(headers);
        setStep('map');
    };

    const handleImport = async (finalMapping: Record<string, string>) => {
        setMapping(finalMapping);
        setStep('importing');

        // Simulate import or batch process
        let successCount = 0;
        const total = csvData.length;
        const batchSize = 10;

        // Helper to get mapped value
        const getValue = (row: any, fieldKey: string) => row[finalMapping[fieldKey]];

        try {
            for (let i = 0; i < total; i += batchSize) {
                const batch = csvData.slice(i, i + batchSize).map(row => ({
                    name: getValue(row, 'name'),
                    company: getValue(row, 'company'),
                    email: getValue(row, 'email'),
                    phone: getValue(row, 'phone') || null,
                    value: parseFloat(getValue(row, 'value')) || 0,
                    stage: getValue(row, 'stage') || 'New',
                }));

                const { error } = await supabase.from('leads').insert(batch);

                if (error) throw error;

                successCount += batch.length;
                setProgress(Math.round((successCount / total) * 100));
            }

            setTimeout(() => {
                onSuccess();
                onClose();
            }, 500);

        } catch (error) {
            console.error('Import failed', error);
            // Handle error state
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white/50 hover:text-white transition-colors"
                >
                    <X />
                </button>

                {step === 'upload' && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-2">Import Leads</h2>
                        <p className="text-white/50 mb-8">Upload a CSV file to bulk import leads into your pipeline.</p>
                        <CSVUploader onDataLoaded={handleDataLoaded} />
                    </div>
                )}

                {step === 'map' && (
                    <CSVHeaderMapper
                        csvHeaders={headers}
                        onMappingComplete={handleImport}
                    />
                )}

                {step === 'importing' && (
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-12 shadow-2xl flex flex-col items-center justify-center text-center">
                        <div className="relative w-24 h-24 mb-6">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#333"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="3"
                                    strokeDasharray={`${progress}, 100`}
                                    className="transition-all duration-300 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                                {progress}%
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Importing Leads...</h3>
                        <p className="text-white/50">Processing your data and adding to pipeline.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportModal;
