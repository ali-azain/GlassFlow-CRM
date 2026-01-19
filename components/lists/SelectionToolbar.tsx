import React from 'react';
import { Trash2, Save, X, Tag } from 'lucide-react';

interface SelectionToolbarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onDelete: () => void;
    onSaveList: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ selectedCount, onClearSelection, onDelete, onSaveList }) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-full shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="flex items-center space-x-2 border-r border-white/10 pr-4 mr-2">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {selectedCount}
                </span>
                <span className="text-sm font-medium text-white">Selected</span>
                <button onClick={onClearSelection} className="text-white/40 hover:text-white transition-colors">
                    <X size={14} />
                </button>
            </div>

            <div className="flex items-center space-x-1">
                <button
                    onClick={onSaveList}
                    className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-white/10 rounded-md text-sm text-white/80 hover:text-white transition-colors"
                >
                    <Save size={14} />
                    <span>Save as List</span>
                </button>
                <button
                    className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-white/10 rounded-md text-sm text-white/80 hover:text-white transition-colors"
                >
                    <Tag size={14} />
                    <span>Add Tag</span>
                </button>
                <div className="w-px h-4 bg-white/10 mx-2" />
                <button
                    onClick={onDelete}
                    className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-red-500/20 rounded-md text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                    <Trash2 size={14} />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
};

export default SelectionToolbar;
