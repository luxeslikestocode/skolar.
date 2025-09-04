import React from 'react';
import { UserIcon, UploadIcon } from './icons';

const ProfilePage: React.FC = () => {
    return (
        <div className="p-8 text-neutral-700 dark:text-neutral-300 animate-fade-in">
            <div className="max-w-3xl mx-auto bg-neutral-100 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800 p-8">
                <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
                    <div className="relative">
                        <div className="w-32 h-32 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <button className="absolute bottom-1 right-1 bg-white dark:bg-neutral-900 p-2 rounded-full border-2 border-neutral-100 dark:border-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
                            <UploadIcon />
                            <span className="sr-only">Upload profile picture</span>
                        </button>
                    </div>
                    <div className="flex-grow w-full text-center sm:text-left">
                        <h3 className="text-2xl font-semibold text-black dark:text-white">John Doe</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">john.doe@example.com</p>
                    </div>
                </div>

                <div className="mt-12 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            defaultValue="John Doe"
                            className="w-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            defaultValue="john.doe@example.com"
                            className="w-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
                        />
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

export default ProfilePage;