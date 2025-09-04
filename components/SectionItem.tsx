import React, { useState, useRef, useEffect } from 'react';
import { type Section, type Lesson } from '../types';
import LessonItem from './LessonItem';
import { ChevronDownIcon, PlusIcon, MoreIcon, TrashIcon, PencilIcon, EmojiIcon, DragHandleIcon } from './icons';

interface SectionItemProps {
  section: Section;
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
  onToggle: (sectionId: string) => void;
  onAddLesson: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
  editingItemId: string | null;
  onSetEditing: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<Section | Lesson>) => void;
  onShowEmojiPicker: (target: {id: string, ref: React.RefObject<HTMLElement>}) => void;
  index: number;
  onReorderSections: (dragIndex: number, hoverIndex: number) => void;
  onReorderLessons: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
}

const SectionItem: React.FC<SectionItemProps> = (props) => {
  const { section, selectedLessonId, onSelectLesson, onToggle, onAddLesson, onDeleteSection, onDeleteLesson, editingItemId, onSetEditing, onUpdate, onShowEmojiPicker, index, onReorderSections, onReorderLessons } = props;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isEditing = editingItemId === section.id;
  const [editedTitle, setEditedTitle] = useState(section.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
        setEditedTitle(section.title);
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
    }
  }, [isEditing, section.title]);
  
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setDropdownOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      setDropdownOpen(prev => !prev);
  };

  const handleTitleChange = () => {
    if (editedTitle.trim() && editedTitle !== section.title) {
        onUpdate(section.id, { title: editedTitle.trim() });
    }
    onSetEditing(null);
  };

  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', `${index}`);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        if(itemRef.current) itemRef.current.classList.add('opacity-30')
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      if(itemRef.current) itemRef.current.classList.remove('opacity-30');
      setIsOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const dragIndex = Number(e.dataTransfer.getData('text/plain'));
      if (dragIndex !== index) {
          onReorderSections(dragIndex, index);
      }
      setIsOver(false);
      if(itemRef.current) itemRef.current.classList.remove('opacity-30');
  };

  return (
    <div 
        ref={itemRef}
        className="relative mb-1 transition-opacity duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
      {isOver && <div className="absolute top-[-1px] left-2 right-2 h-0.5 bg-neutral-500 dark:bg-neutral-400 z-10 rounded-full" />}
      <div className="flex w-full items-center justify-between p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800/60 group">
        <div className="flex items-center flex-grow min-w-0">
            <span 
              className="cursor-move text-neutral-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
                <DragHandleIcon/>
            </span>
            <button onClick={() => onToggle(section.id)} className="flex items-center text-left text-sm font-medium text-neutral-600 dark:text-neutral-300">
                <span className={`transform transition-transform duration-200 ${section.isOpen ? 'rotate-0' : '-rotate-90'}`}><ChevronDownIcon /></span>
            </button>
            <button ref={iconButtonRef} onClick={() => onShowEmojiPicker({id: section.id, ref: iconButtonRef})} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700/80">
                {section.icon ? <span className="text-lg">{section.icon}</span> : <EmojiIcon/>}
            </button>
            {isEditing ? (
                 <input
                    ref={titleInputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleChange}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleTitleChange(); if (e.key === 'Escape') onSetEditing(null); }}
                    className="w-full bg-neutral-200 dark:bg-neutral-700/50 rounded-md px-2 py-0.5 text-sm text-black dark:text-white placeholder-neutral-500 focus:outline-none"
                />
            ) : (
                <h3 onClick={() => onToggle(section.id)} className="ml-1 truncate text-sm font-medium text-neutral-800 dark:text-neutral-300 cursor-pointer">{section.title}</h3>
            )}
        </div>
        <div className="relative ml-2">
            <button onClick={handleDropdownToggle} className="text-neutral-500 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="Section options">
                <MoreIcon />
            </button>
            {isDropdownOpen && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1F1F1F] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-1 z-10 origin-top-right">
                    <button onClick={(e) => { e.stopPropagation(); onSetEditing(section.id); setDropdownOpen(false); }} className="w-full text-left flex items-center px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                        <PencilIcon/> <span className="ml-2">Edit</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id); }} className="w-full text-left flex items-center px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                        <TrashIcon/> <span className="ml-2">Delete</span>
                    </button>
                </div>
            )}
        </div>
      </div>
      <div className={`ml-4 pl-3 border-l border-neutral-300 dark:border-neutral-700/50 overflow-hidden transition-all duration-300 ease-in-out ${section.isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {section.lessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              index={lessonIndex}
              sectionId={section.id}
              isSelected={lesson.id === selectedLessonId}
              onSelect={() => onSelectLesson(lesson.id)}
              onDelete={onDeleteLesson}
              editingItemId={editingItemId}
              onSetEditing={onSetEditing}
              onUpdate={onUpdate}
              onShowEmojiPicker={onShowEmojiPicker}
              onReorderLessons={onReorderLessons}
            />
          ))}
          <button onClick={() => onAddLesson(section.id)} className="flex items-center w-full text-left p-2 my-1 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors rounded-md">
            <PlusIcon />
            <span className="ml-3">Add lesson</span>
          </button>
      </div>
    </div>
  );
};

export default SectionItem;