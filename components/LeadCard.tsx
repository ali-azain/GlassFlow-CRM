import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, DollarSign, Calendar, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Lead } from '../types';
import { Task, TaskStatus } from '../types';
import { getTasks, createTask, updateTask, deleteTask } from '../lib/tasks';
import TaskCard from './tasks/TaskCard';
import TaskForm from './tasks/TaskForm';

interface LeadCardProps {
    lead: Lead;
    onDragStart: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onDragStart }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [loadingTasks, setLoadingTasks] = useState(false);

    useEffect(() => {
        if (isExpanded) {
            loadTasks();
        }
    }, [isExpanded]);

    const loadTasks = async () => {
        setLoadingTasks(true);
        const data = await getTasks(lead.id);
        setTasks(data);
        setLoadingTasks(false);
    };

    const handleCreateTask = async (taskData: Partial<Task>) => {
        try {
            if (editingTask) {
                const updated = await updateTask(editingTask.id, taskData);
                setTasks(tasks.map(t => t.id === updated.id ? updated : t));
            } else {
                const newHelper = { ...taskData, lead_id: lead.id } as any;
                const created = await createTask(newHelper);
                setTasks([created, ...tasks]);
            }
            setShowTaskForm(false);
            setEditingTask(undefined);
        } catch (error) {
            console.error('Failed to save task', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    const handleToggleStatus = async (task: Task) => {
        const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
        try {
            const updated = await updateTask(task.id, { status: newStatus });
            setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        } catch (error) {
            console.error('Failed to toggle status', error);
        }
    };

    return (
        <motion.div
            layout
            draggable
            onDragStart={() => onDragStart(lead.id)}
            className="attio-card p-4 cursor-grab active:cursor-grabbing group shadow-sm bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow relative"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.company}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{lead.name}</span>
                </div>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={14} />
                </button>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F1F1F1]">
                <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-[11px]">
                    <DollarSign size={10} strokeWidth={3} />
                    <span>{(lead.value / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-slate-400">
                        <Calendar size={10} />
                        <span className="text-[10px] font-medium">{lead.lastActivity}</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                    >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {/* Expanded Task View */}
            {isExpanded && (
                <div className="mt-4 pt-3 border-t border-dashed border-slate-200 space-y-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks</h4>
                        <button
                            onClick={() => { setEditingTask(undefined); setShowTaskForm(true); }}
                            className="text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 rounded-full p-1"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    {showTaskForm && (
                        <div className="absolute inset-0 z-10 p-2 flex items-start justify-center">
                            <div className="bg-white rounded-lg shadow-xl w-full border border-slate-200">
                                <TaskForm
                                    initialTask={editingTask}
                                    onSave={handleCreateTask}
                                    onCancel={() => { setShowTaskForm(false); setEditingTask(undefined); }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
                        {loadingTasks ? (
                            <div className="text-center py-2 text-[10px] text-slate-400">Loading tasks...</div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-2 text-[10px] text-slate-400 italic">No tasks yet</div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="transform scale-95 origin-top-left w-full">
                                    {/* Reusing TaskCard but adjusting styles might be needed as TaskCard is styled for dark mode/glass by default. 
                                I'll need to update TaskCard to be theme-aware or just override styles if needed.
                                For now, I'll wrap it in a dark container since the TaskCard styles are heavily "white/10" which implies dark background. 
                                OR I should make TaskCard agnostic.
                                Let's assume the user wants the "Glassy" look described in the PRD.
                                The LeadCard is "bg-white", so putting "white/10" card on top won't work well.
                                I'll wrap the Task section in a dark gradient to match the design aesthetic requested ("GlassFlow").
                            */}
                                    <div className="bg-slate-900 rounded-lg overflow-hidden p-1 shadow-inner">
                                        <TaskCard
                                            task={task}
                                            onEdit={(t) => { setEditingTask(t); setShowTaskForm(true); }}
                                            onDelete={handleDeleteTask}
                                            onToggleStatus={handleToggleStatus}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default LeadCard;
