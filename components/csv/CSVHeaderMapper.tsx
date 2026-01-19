import React, { useState, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { LeadStage } from '../../types';

interface HeaderMapperProps {
    csvHeaders: string[];
    onMappingComplete: (mapping: Record<string, string>) => void;
}

const CRM_FIELDS = [
    { key: 'name', label: 'Name', required: true },
    { key: 'company', label: 'Company', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'value', label: 'Value', required: false },
    { key: 'stage', label: 'Stage', required: false },
];

const CSVHeaderMapper: React.FC<HeaderMapperProps> = ({ csvHeaders, onMappingComplete }) => {
    const [mapping, setMapping] = useState<Record<string, string>>({});

    // Auto-map logic
    useEffect(() => {
        const newMapping: Record<string, string> = {};
        CRM_FIELDS.forEach(field => {
            const match = csvHeaders.find(header =>
                header.toLowerCase().includes(field.key) ||
                header.toLowerCase() === field.label.toLowerCase()
            );
            if (match) {
                newMapping[field.key] = match;
            }
        });
        setMapping(newMapping);
    }, [csvHeaders]);

    const handleFieldChange = (crmField: string, csvHeader: string) => {
        setMapping(prev => ({ ...prev, [crmField]: csvHeader }));
    };

    const isMappingValid = () => {
        return CRM_FIELDS.filter(f => f.required).every(f => mapping[f.key]);
    };

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Map Fields</h3>
            <p className="text-white/50 text-sm mb-6">Match your CSV columns to the corresponding fields in GlassFlow CRM.</p>

            <div className="space-y-3">
                {CRM_FIELDS.map((field) => (
                    <div key={field.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center space-x-3 w-1/3">
                            <div className={`w-2 h-2 rounded-full ${field.required ? 'bg-blue-500' : 'bg-white/20'}`} />
                            <span className="text-sm font-medium text-white">{field.label}</span>
                            {field.required && <span className="text-[10px] text-white/30 uppercase">Required</span>}
                        </div>

                        <ArrowRight size={14} className="text-white/20" />

                        <div className="w-1/2">
                            <select
                                value={mapping[field.key] || ''}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                className={`w-full bg-[#1A1A1A] text-white text-sm rounded border px-3 py-2 outline-none appearance-none cursor-pointer transition-colors ${mapping[field.key] ? 'border-blue-500/50 text-blue-100' : 'border-white/10 text-white/50 hover:border-white/20'
                                    }`}
                            >
                                <option value="">Select column...</option>
                                {csvHeaders.map(header => (
                                    <option key={header} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={() => onMappingComplete(mapping)}
                    disabled={!isMappingValid()}
                    className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all ${isMappingValid()
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                >
                    <span>Continue Import</span>
                    <Check size={16} />
                </button>
            </div>
        </div>
    );
};

export default CSVHeaderMapper;
