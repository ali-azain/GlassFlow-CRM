import React, { useEffect, useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Calendar, CheckCircle, AlertTriangle, Flame } from 'lucide-react';
import TaskCard from './tasks/TaskCard';
import TaskForm from './tasks/TaskForm';

const TasksView: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        loadAllTasks();
    }, []);

    const loadAllTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            setTasks(data as Task[]);
        }
        setLoading(false);
    };

    const handleDeleteTask = async (id: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (!error) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const handleUpdateTask = async (updatedTask: Partial<Task>) => {
        // In this view we only handle updates, creating is done on lead card context usually
        // But we can implement universal create later if needed.
        if (!editingTask) return;

        const { data, error } = await supabase
            .from('tasks')
            .update(updatedTask)
            .eq('id', editingTask.id)
            .select()
            .single();

        if (!error && data) {
            setTasks(tasks.map(t => t.id === editingTask.id ? data as Task : t));
            setEditingTask(null);
        }
    };

    const toggleTaskStatus = async (task: Task) => {
        const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', task.id);

        if (!error) {
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
        }
    };

    const todoTasks = tasks.filter(t => t.status !== TaskStatus.DONE);
    const doneTasks = tasks.filter(t => t.status === TaskStatus.DONE);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
                <p className="text-slate-500 text-sm mt-1">Manage all your to-dos in one place.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">To Do</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">{todoTasks.length}</span>
                    </div>
                    <div className="space-y-3">
                        {todoTasks.map(task => (
                            <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-1 shadow-sm hover:shadow-md transition-shadow">
                                {/* Reuse TaskCard but we might need to adjust it for light mode if it was hardcoded for dark. 
                        Let's check TaskCard implementation again or wrap it. 
                        The TaskCard was built with 'white/10' implying dark mode.
                        For this view which is likely light mode (based on DashboardView), we might need a variant or wrap it in dark.
                        However, the user asked for a "separate tasks section", I should stick to the app's theme.
                        The App seems to be Light Mode based on CrmApp.tsx (bg-[#FBFBFB], text-[#1A1A1A]).
                        
                        I will wrap the TaskCard in a dark container or I should have refactored TaskCard.
                        Given the constraints, I will wrap it in a dark card for now to maintain the aesthetic designed earlier, 
                        or I will create a simple light mode list item here to fit the dashboard theme better.
                        
                        Actually, let's look at the TaskCard again in my mind... 
                        It uses `bg-white/5` and `text-white`. It is definitely designed for dark mode.
                        
                        To make it look good in the light mode app, I should probably create a specific rendering here 
                        OR wrap it in a dark container. 
                        Let's render a custom list item here for better integration with the light theme of the dashboard.
                    */}
                                <div className="flex items-start p-3 group">
                                    <button
                                        onClick={() => toggleTaskStatus(task)}
                                        className="mr-3 mt-0.5 w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center hover:border-blue-500 transition-colors"
                                    >
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-slate-900">{task.title}</span>
                                            {task.priority === TaskPriority.HIGH && <Flame size={14} className="text-red-500" />}
                                            {task.priority === TaskPriority.MEDIUM && <AlertTriangle size={14} className="text-amber-500" />}
                                        </div>
                                        {task.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>}
                                        {task.due_date && (
                                            <div className="flex items-center mt-2 text-[10px] text-slate-400">
                                                <Calendar size={12} className="mr-1" />
                                                <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {todoTasks.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                                <p className="text-slate-400 text-sm">No pending tasks</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">{doneTasks.length}</span>
                    </div>
                    <div className="space-y-3 opacity-60">
                        {doneTasks.map(task => (
                            <div key={task.id} className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center">
                                <button
                                    onClick={() => toggleTaskStatus(task)}
                                    className="mr-3 w-4 h-4 rounded-full bg-emerald-500 border border-emerald-500 flex items-center justify-center text-white"
                                >
                                    <CheckCircle size={10} />
                                </button>
                                <span className="text-sm text-slate-500 line-through">{task.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Modal could go here if we implemented edit from this view */}
        </div>
    );
};

// Start of some local icons to avoid import errors if lucide-react versions mismatch
import { Trash2 } from 'lucide-react';

export default TasksView;
