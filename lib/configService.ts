
import { supabase } from './supabaseClient';

export interface SystemConfig {
    id?: string;
    category: 'payment_c2b' | 'payment_b2c' | 'database' | 'api_integration';
    key: string;
    value: string;
    description?: string;
    is_active: boolean;
}

export const getSystemConfigs = async (): Promise<SystemConfig[]> => {
    const { data, error } = await supabase
        .from('system_configs')
        .select('*')
        .order('category', { ascending: true });
    
    if (error) {
        console.error('Error fetching configs:', error);
        return [];
    }
    return data || [];
};

export const saveSystemConfig = async (config: SystemConfig) => {
    // Check if key exists to avoid duplicates if not editing
    if (!config.id) {
        const { data: existing } = await supabase
            .from('system_configs')
            .select('id')
            .eq('key', config.key)
            .single();
            
        if (existing) {
             return { success: false, message: 'Key already exists.' };
        }
    }

    let error;
    if (config.id) {
        // Update
        const { error: updateErr } = await supabase
            .from('system_configs')
            .update({
                category: config.category,
                key: config.key,
                value: config.value,
                description: config.description,
                is_active: config.is_active
            })
            .eq('id', config.id);
        error = updateErr;
    } else {
        // Insert
        const { error: insertErr } = await supabase
            .from('system_configs')
            .insert([{
                category: config.category,
                key: config.key,
                value: config.value,
                description: config.description,
                is_active: config.is_active
            }]);
        error = insertErr;
    }

    if (error) return { success: false, message: error.message };
    return { success: true };
};

export const deleteSystemConfig = async (id: string) => {
    const { error } = await supabase.from('system_configs').delete().eq('id', id);
    return !error;
};

export const ensureConfigTable = async () => {
    // Table creation is handled by SQL script in AdminSettings
    return true;
};
