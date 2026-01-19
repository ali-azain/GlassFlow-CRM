import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { X, Calendar, AlertTriangle, Flame, Clock } from 'lucide-react';

interface TaskFormProps {
    initialTask?: Partial<Task>;
    onSave: (task: Partial<Task>) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSave, onCancel }) => {
    const [title, setTitle] = useState(initialTask?.title || '');
    const [description, setDescription] = useState(initialTask?.description || '');
    const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || TaskPriority.MEDIUM);
    const [dueDate, setDueDate] = useState(initialTask?.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...initialTask,
            title,
            description,
            priority,
            due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
            status: initialTask?.status || TaskStatus.TODO
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">
                    {initialTask?.id ? 'Edit Task' : 'New Task'}
                </h3>
                <button type="button" onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <input
                        autoFocus
                        type="text"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                        required
                    />
                </div>

                <div>
                    <textarea
                        placeholder="Add details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded p-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/20 min-h-[60px] resize-none"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex-1">
                        <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Priority</label>
                        <div className="flex bg-white/5 rounded p-1">
                            {[TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 flex items-center justify-center py-1 rounded text-xs transition-all ${priority === p
                                            ? 'bg-white/10 text-white shadow-sm'
                                            : 'text-white/40 hover:text-white/60'
                                        }`}
                                    title={p}
                                >
                                    {p === TaskPriority.LOW && <Clock size={12} />}
                                    {p === TaskPriority.MEDIUM && <AlertTriangle size={12} />}
                                    {p === TaskPriority.HIGH && <Flame size={12} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">Due Date</label>
                        <div className="relative group">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded py-1 pl-7 pr-2 text-xs text-white/80 focus:outline-none focus:border-white/20 cursor-pointer"
                            />
                            <Calendar size={12} className="absolute left-2 top-1.5 text-white/40 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-lg shadow-blue-500/20"
                >
                    {initialTask?.id ? 'Save Changes' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
