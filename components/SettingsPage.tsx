import React from 'react';
import { type Settings } from '../types';

interface SettingsPageProps {
    settings: Settings;
    onUpdateSettings: (updates: Partial<Settings> | ((s:Settings) => Partial<Settings>)) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings }) => {

    const Toggle: React.FC<{ 
        label: string, 
        description: string, 
        enabled: boolean,
        onChange: (enabled: boolean) => void 
    }> = ({ label, description, enabled, onChange }) => (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-black dark:text-white">{label}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
            </div>
            <button onClick={() => onChange(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-neutral-800 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    const handleNotificationChange = (key: keyof Settings['notifications'], value: boolean) => {
        onUpdateSettings((prevSettings) => ({
            notifications: {
                ...prevSettings.notifications,
                [key]: value,
            }
        }));
    };

    return (
        <div className="p-8 text-neutral-700 dark:text-neutral-300 animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-10">
                {/* General Section */}
                <div className="bg-neutral-100 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 className="text-lg font-semibold text-black dark:text-white">General</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Manage your account and workspace settings.</p>
                    </div>
                    <div className="p-6 space-y-4">
                         <div>
                            <label htmlFor="workspace" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Workspace Name</label>
                            <input
                                type="text"
                                id="workspace"
                                value={settings.workspaceName}
                                onChange={(e) => onUpdateSettings({ workspaceName: e.target.value })}
                                className="w-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-neutral-100 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 className="text-lg font-semibold text-black dark:text-white">Notifications</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Control how you receive notifications.</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <Toggle 
                            label="Email Notifications" 
                            description="Receive updates and digests in your inbox." 
                            enabled={settings.notifications.email}
                            onChange={(value) => handleNotificationChange('email', value)}
                        />
                        <Toggle 
                            label="Push Notifications" 
                            description="Get notified in-app about important events." 
                            enabled={settings.notifications.push}
                            onChange={(value) => handleNotificationChange('push', value)}
                        />
                        <Toggle 
                            label="Weekly Reports" 
                            description="Get a summary of your workspace activity." 
                            enabled={settings.notifications.reports}
                            onChange={(value) => handleNotificationChange('reports', value)}
                        />
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="bg-neutral-100 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 className="text-lg font-semibold text-black dark:text-white">Appearance</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Customize the look and feel of the app.</p>
                    </div>
                    <div className="p-6">
                         <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Theme</label>
                            <select 
                                id="theme" 
                                value={settings.theme}
                                onChange={(e) => onUpdateSettings({ theme: e.target.value as Settings['theme'] })}
                                className="w-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors">
                                <option>Dark</option>
                                <option>Light</option>
                                <option>System</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SettingsPage;