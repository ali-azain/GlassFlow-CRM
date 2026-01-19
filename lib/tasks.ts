import { supabase } from './supabaseClient';
import { Task } from '../types';

export async function getTasks(leadId: string) {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }

    return data as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

    if (error) {
        console.error('Error creating task:', error);
        throw error;
    }

    return data as Task;
}

export async function updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating task:', error);
        throw error;
    }

    return data as Task;
}

export async function deleteTask(id: string) {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}
