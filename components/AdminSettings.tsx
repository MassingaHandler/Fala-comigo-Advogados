
import React, { useState, useEffect } from 'react';
import { 
    SettingsIcon, DatabaseIcon, ServerIcon, SmartphoneIcon, 
    PlusIcon, SaveIcon, TrashIcon, LockIcon, ChevronLeftIcon, ClipboardIcon 
} from './ui/icons';
import { getSystemConfigs, saveSystemConfig, deleteSystemConfig, ensureConfigTable, type SystemConfig } from '../lib/configService';
import { isSupabaseConfigured, getSupabaseSetupSQL } from '../lib/supabaseClient';

interface Props {
    onBack: () => void;
}

type Tab = 'payments' | 'databases' | 'apis' | 'setup';

export default function AdminSettings({ onBack }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('payments');
    const [configs, setConfigs] = useState<SystemConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [copyFeedback, setCopyFeedback] = useState('');
    
    // Form state for new/editing item
    const [editForm, setEditForm] = useState<Partial<SystemConfig>>({});

    useEffect(() => {
        if (activeTab !== 'setup') {
            loadData();
        } else {
            setLoading(false);
        }
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        if (isSupabaseConfigured()) {
             await ensureConfigTable().catch(e => console.log("Table check skipped"));
        }
        const data = await getSystemConfigs();
        setConfigs(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editForm.key || !editForm.category) {
            alert("Category and Key are required.");
            return;
        }

        const newConfig = {
            ...editForm,
            value: editForm.value || '',
            is_active: editForm.is_active ?? true,
        } as SystemConfig;

        const result = await saveSystemConfig(newConfig);
        if (result.success) {
            await loadData(); 
            setIsEditing(null);
            setEditForm({});
        } else {
            alert("Failed to save: " + result.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this configuration?")) return;
        const success = await deleteSystemConfig(id);
        if (success) {
            setConfigs(configs.filter(c => c.id !== id));
        } else {
            alert("Failed to delete.");
        }
    };

    const startEdit = (config: SystemConfig) => {
        setIsEditing(config.id || 'new'); 
        setEditForm({ ...config });
    };

    const startNew = () => {
        setIsEditing('new_entry');
        let defaultCat: SystemConfig['category'] = 'payment_c2b';
        if (activeTab === 'databases') defaultCat = 'database';
        if (activeTab === 'apis') defaultCat = 'api_integration';

        setEditForm({
            category: defaultCat,
            key: '',
            value: '',
            description: '',
            is_active: true
        });
    };

    const copySQL = () => {
        const sql = getSupabaseSetupSQL();
        navigator.clipboard.writeText(sql);
        setCopyFeedback('Copied!');
        setTimeout(() => setCopyFeedback(''), 2000);
    }

    const filteredConfigs = configs.filter(c => {
        if (activeTab === 'payments') return c.category.startsWith('payment');
        if (activeTab === 'databases') return c.category === 'database';
        if (activeTab === 'apis') return c.category === 'api_integration';
        return false;
    });

    const renderTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 uppercase">
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Key / Identifier</th>
                        <th className="py-3 px-4">Value (Config)</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredConfigs.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">No configurations found for this section.</td>
                        </tr>
                    ) : (
                        filteredConfigs.map((config, idx) => (
                            <tr key={config.id || idx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="py-3 px-4">
                                    <span className={`w-3 h-3 rounded-full inline-block mr-2 ${config.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    {config.is_active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="py-3 px-4 font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {config.key}
                                    {config.category === 'payment_b2c' && <span className="ml-2 text-[10px] bg-purple-100 text-purple-800 px-1 rounded">B2C</span>}
                                    {config.category === 'payment_c2b' && <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-1 rounded">C2B</span>}
                                </td>
                                <td className="py-3 px-4 font-mono text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                                    {config.key.includes('KEY') || config.key.includes('SECRET') || config.key.includes('PASSWORD') 
                                        ? '••••••••••••••' 
                                        : config.value}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">{config.description}</td>
                                <td className="py-3 px-4 text-right">
                                    <button onClick={() => startEdit(config)} className="text-blue-600 hover:underline mr-4 text-sm">Edit</button>
                                    {config.id && (
                                        <button onClick={() => handleDelete(config.id!)} className="text-red-600 hover:underline text-sm">Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderEditModal = () => {
        if (!isEditing) return null;
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                        {editForm.id ? 'Edit Configuration' : 'New Configuration'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                            <select 
                                value={editForm.category} 
                                onChange={e => setEditForm({...editForm, category: e.target.value as any})}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="payment_c2b">Payment (C2B) - M-Pesa</option>
                                <option value="payment_b2c">Payment (B2C) - M-Pesa</option>
                                <option value="database">Database Connection</option>
                                <option value="api_integration">External API</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Key / Identifier</label>
                            <input 
                                type="text" 
                                value={editForm.key || ''}
                                onChange={e => setEditForm({...editForm, key: e.target.value.toUpperCase().replace(/\s/g, '_')})}
                                placeholder="e.g., MPESA_API_KEY"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value (Settings)</label>
                            <textarea 
                                value={editForm.value || ''}
                                onChange={e => setEditForm({...editForm, value: e.target.value})}
                                placeholder="Enter the API key, connection string, or endpoint URL"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 font-mono h-24"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <input 
                                type="text" 
                                value={editForm.description || ''}
                                onChange={e => setEditForm({...editForm, description: e.target.value})}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={editForm.is_active ?? true}
                                onChange={e => setEditForm({...editForm, is_active: e.target.checked})}
                                className="w-4 h-4 text-red-600"
                            />
                            <label className="text-sm text-gray-700 dark:text-gray-300">Configuration Active</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => { setIsEditing(null); setEditForm({}); }} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 flex items-center gap-2">
                            <SaveIcon className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!isSupabaseConfigured()) {
        return (
            <div className="p-8 text-center animate-fade-in bg-white dark:bg-gray-800 rounded-lg shadow">
                <h2 className="text-xl font-bold text-red-600 mb-2">System Database Not Connected</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">You need to configure Supabase in `lib/supabaseClient.ts` to use the Admin Panel.</p>
                <button onClick={onBack} className="text-blue-600 hover:underline flex items-center justify-center gap-2 mx-auto">
                    <ChevronLeftIcon className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Admin Header */}
            <header className="bg-gray-900 text-white p-4 shadow-lg z-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <SettingsIcon className="w-6 h-6 text-red-500" />
                    <div>
                        <h1 className="text-lg font-bold">System Administration</h1>
                        <p className="text-xs text-gray-400">Integrations & Configurations Hub</p>
                    </div>
                </div>
                <button onClick={onBack} className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded flex items-center gap-2 transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" /> Exit
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Tabs */}
                <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
                    <nav className="flex-1 p-4 space-y-2">
                        <button 
                            onClick={() => setActiveTab('payments')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <SmartphoneIcon className="w-5 h-5" />
                            Payments (MNOs)
                        </button>
                        <button 
                            onClick={() => setActiveTab('databases')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'databases' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <DatabaseIcon className="w-5 h-5" />
                            Databases
                        </button>
                        <button 
                            onClick={() => setActiveTab('apis')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'apis' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <ServerIcon className="w-5 h-5" />
                            API Integrations
                        </button>
                        
                        <div className="border-t dark:border-gray-700 my-4 pt-4">
                            <button 
                                onClick={() => setActiveTab('setup')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'setup' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <DatabaseIcon className="w-5 h-5" />
                                Database Setup
                            </button>
                        </div>
                    </nav>
                    <div className="p-4 border-t dark:border-gray-700">
                         <div className="flex items-center gap-2 text-xs text-gray-500">
                             <LockIcon className="w-3 h-3" />
                             <span>Secure Enclave Active</span>
                         </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    <div className="p-6 flex justify-between items-center border-b dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
                                {activeTab === 'payments' ? 'Payment Gateways (M-Pesa)' : 
                                 activeTab === 'databases' ? 'Database Connections' : 
                                 activeTab === 'apis' ? 'System API Integrations' : 'Database Setup (SQL)'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {activeTab === 'payments' && "Manage C2B (Collections) and B2C (Disbursements) keys."}
                                {activeTab === 'databases' && "Configure connection strings for remote or on-premise SQL/NoSQL databases."}
                                {activeTab === 'apis' && "Setup endpoints and secrets for third-party system integrations."}
                                {activeTab === 'setup' && "Run this SQL script in your Supabase SQL Editor to create the necessary tables."}
                            </p>
                        </div>
                        {activeTab !== 'setup' && (
                            <button onClick={startNew} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md transition-transform hover:scale-105">
                                <PlusIcon className="w-4 h-4" /> Add New Config
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'setup' ? (
                             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                                    <span className="font-mono text-sm text-gray-500">setup_tables.sql</span>
                                    <button onClick={copySQL} className="text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 px-3 py-1.5 rounded flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        <ClipboardIcon className="w-4 h-4" /> 
                                        {copyFeedback || 'Copy to Clipboard'}
                                    </button>
                                </div>
                                <pre className="flex-1 p-4 overflow-auto font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50">
                                    {getSupabaseSetupSQL()}
                                </pre>
                             </div>
                        ) : loading ? (
                             <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                             </div>
                        ) : (
                             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                                 {renderTable()}
                             </div>
                        )}
                    </div>
                </main>
            </div>
            
            {/* Modals */}
            {renderEditModal()}
        </div>
    );
}
