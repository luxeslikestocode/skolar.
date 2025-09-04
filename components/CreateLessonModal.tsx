import React, { useState, useRef, useEffect } from 'react';

interface CreateLessonModalProps {
    onCreate: (title: string, icon: string) => void;
    onClose: () => void;
    onShowEmojiPicker: (target: { id: string; ref: React.RefObject<HTMLElement> }) => void;
    selectedIcon: string;
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ onCreate, onClose, onShowEmojiPicker, selectedIcon }) => {
    const [title, setTitle] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                if (!document.querySelector('emoji-picker')) {
                    onClose();
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        inputRef.current?.focus();
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onCreate(title.trim(), selectedIcon);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out animate-fade-in">
            <div ref={modalRef} className="bg-white dark:bg-[#181818] rounded-lg shadow-xl w-full max-w-md border border-neutral-200 dark:border-neutral-700 transform transition-all duration-300 ease-in-out animate-slide-up">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-black dark:text-white">Create new lesson</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1 text-sm">Enter a title and select an icon for your new lesson.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="px-6 pb-6 flex items-center space-x-3">
                        <button
                            type="button"
                            ref={emojiButtonRef}
                            onClick={() => onShowEmojiPicker({ id: 'new-lesson-icon-target', ref: emojiButtonRef })}
                            className="p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md text-2xl hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        >
                            {selectedIcon}
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Introduction to Figma"
                            className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-colors"
                            required
                        />
                    </div>
                    <div className="bg-neutral-50 dark:bg-[#1F1F1F] px-6 py-4 rounded-b-lg flex justify-end space-x-3 border-t border-neutral-200 dark:border-neutral-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white dark:text-black bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 rounded-md transition-colors">
                            Create lesson
                        </button>
                    </div>
                </form>
            </div>
            {/* Using the same styles as CreateCourseModal */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { transform: translateY(20px) scale(0.98); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CreateLessonModal;