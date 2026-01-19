import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Check, Clock, AlertTriangle, Flame, Trash2, Edit2 } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
    const getPriorityColor = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.HIGH: return 'bg-red-500/10 text-red-500 border-red-500/20';
            case TaskPriority.MEDIUM: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case TaskPriority.LOW: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    const getPriorityIcon = (priority: TaskPriority) => {
        switch (priority) {
            case TaskPriority.HIGH: return <Flame size={12} />;
            case TaskPriority.MEDIUM: return <AlertTriangle size={12} />;
            case TaskPriority.LOW: return <Clock size={12} />;
        }
    };

    return (
        <div className="group relative flex items-start p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200">
            {/* Checkbox / Status Toggle */}
            <button
                onClick={() => onToggleStatus(task)}
                className={`mt-0.5 mr-3 flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${task.status === TaskStatus.DONE
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-white/30 hover:border-white/60'
                    }`}
            >
                {task.status === TaskStatus.DONE && <Check size={10} className="text-white" />}
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium truncate ${task.status === TaskStatus.DONE ? 'text-white/40 line-through' : 'text-white/90'}`}>
                        {task.title}
                    </span>
                    <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span>{task.priority}</span>
                    </div>
                </div>

                {task.description && (
                    <p className="text-xs text-white/50 mb-2 line-clamp-2">{task.description}</p>
                )}

                {task.due_date && (
                    <div className="flex items-center text-[10px] text-white/40">
                        <Clock size={10} className="mr-1" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            {/* Action Buttons (visible on hover) */}
            <div className="absolute right-2 top-2 hidden group-hover:flex space-x-1">
                <button
                    onClick={() => onEdit(task)}
                    className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                >
                    <Edit2 size={12} />
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 hover:bg-red-500/10 rounded text-white/60 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
