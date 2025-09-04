import React, { useState, useRef, useEffect } from 'react';
// Fix: Import Lesson type.
import { type Section, type Lesson } from '../types';
import SectionItem from './SectionItem';
import { CopyIcon, ChevronDownIcon, DashboardIcon, CourseIcon, PlusIcon } from './icons';

type View = 'dashboard' | 'editor' | 'profile' | 'settings';

interface SidebarProps {
  sections: Section[];
  selectedLessonId: string | null;
  activeView: View;
  onSelectLesson: (lessonId: string) => void;
  onToggleSection: (sectionId: string) => void;
  onAddLesson: (sectionId: string) => void;
  onAddSection: (title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  onNavigate: (view: View) => void;
  editingItemId: string | null;
  onSetEditing: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<Section | Lesson>) => void;
  onShowEmojiPicker: (target: {id: string, ref: React.RefObject<HTMLElement>}) => void;
  onReorderSections: (dragIndex: number, hoverIndex: number) => void;
  onReorderLessons: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
}

const NavLink: React.FC<{icon: React.ReactNode, label: string, selected?: boolean, onClick?: () => void}> = ({icon, label, selected, onClick}) => (
    <button onClick={onClick} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${selected ? 'bg-neutral-200 dark:bg-neutral-700/50 text-black dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'}`}>
        {icon}
        <span className="ml-3">{label}</span>
    </button>
);

const NewSectionInput: React.FC<{onAdd: (title: string) => void}> = ({onAdd}) => {
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = () => {
        onAdd(title);
    };

    return (
        <div className="pl-5 pr-2 py-1">
            <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder="New section title..."
                className="w-full bg-white dark:bg-neutral-900/80 border border-neutral-300 dark:border-neutral-700 rounded-md px-2 py-1.5 text-sm text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { sections, selectedLessonId, activeView, onSelectLesson, onToggleSection, onAddLesson, onAddSection, onDeleteSection, onDeleteLesson, onNavigate, editingItemId, onSetEditing, onUpdate, onShowEmojiPicker, onReorderSections, onReorderLessons } = props;
  const [copyText, setCopyText] = useState('Copy link');
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
            setPreviewOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
          setCopyText('Copied!');
          setTimeout(() => setCopyText('Copy link'), 2000);
      }).catch(err => console.error('Failed to copy: ', err));
  };
  
  const handleAddNewSection = (title: string) => {
      if (title.trim()) {
          onAddSection(title.trim());
      }
      setIsAddingSection(false);
  };

  return (
    <aside className="h-full w-[320px] bg-neutral-50 dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-800 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-center justify-between">
              <div className="flex items-center">
                  <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-300 dark:border-neutral-700">
                    <span className="font-bold text-black dark:text-white text-lg">b</span>
                    <span className="font-bold text-black dark:text-white text-lg">f.</span>
                  </div>
                  <div className="ml-3">
                      <p className="text-black dark:text-white font-semibold">byteflow</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Online</p>
                  </div>
              </div>
              <button onClick={handleCopyLink} className="bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-md flex items-center text-sm transition-colors w-28 justify-center">
                  <CopyIcon />
                  <span className="ml-2">{copyText}</span>
              </button>
          </div>
          <div className="mt-4 relative" ref={previewRef}>
              <button onClick={() => setPreviewOpen(prev => !prev)} className="w-full flex items-center justify-between bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 rounded-md text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800/80">
                  <span className="text-neutral-500 dark:text-neutral-400">PREVIEW AS</span>
                  <ChevronDownIcon/>
              </button>
              {isPreviewOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1F1F1F] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-1 z-20">
                      <a href="#" className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">Student</a>
                      <a href="#" className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">Admin</a>
                  </div>
              )}
          </div>
      </div>
      <nav className="flex-grow overflow-y-auto px-2 py-4 space-y-1">
        <NavLink icon={<DashboardIcon />} label="Dashboard" selected={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />

        {activeView === 'editor' && (
            <div className="pt-2">
                <div className="px-2 text-xs font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider mb-1 flex justify-between items-center">
                    <span>Course Content</span>
                    <button onClick={(e) => { e.stopPropagation(); setIsAddingSection(true); }} className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="Add new section">
                        <PlusIcon/>
                    </button>
                </div>
                {isAddingSection && <NewSectionInput onAdd={handleAddNewSection} />}
                {sections.map((section, index) => (
                    <SectionItem
                        key={section.id}
                        index={index}
                        section={section}
                        selectedLessonId={selectedLessonId}
                        onSelectLesson={onSelectLesson}
                        onToggle={onToggleSection}
                        onAddLesson={onAddLesson}
                        onDeleteSection={onDeleteSection}
                        onDeleteLesson={onDeleteLesson}
                        editingItemId={editingItemId}
                        onSetEditing={onSetEditing}
                        onUpdate={onUpdate}
                        onShowEmojiPicker={onShowEmojiPicker}
                        onReorderSections={onReorderSections}
                        onReorderLessons={onReorderLessons}
                    />
                ))}
            </div>
        )}
    </nav>
    </aside>
  );
};

export default Sidebar;