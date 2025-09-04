import React, { useState, useRef, useEffect } from 'react';
import { type Lesson } from '../types';
import { DocumentIcon, MoreIcon, TrashIcon, PencilIcon, EmojiIcon, DragHandleIcon } from './icons';

interface LessonItemProps {
  lesson: Lesson;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (lessonId: string) => void;
  editingItemId: string | null;
  onSetEditing: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<Lesson>) => void;
  onShowEmojiPicker: (target: {id: string, ref: React.RefObject<HTMLElement>}) => void;
  index: number;
  sectionId: string;
  onReorderLessons: (sectionId: string, dragIndex: number, hoverIndex: number) => void;
}

const LessonItem: React.FC<LessonItemProps> = (props) => {
    const { lesson, isSelected, onSelect, onDelete, editingItemId, onSetEditing, onUpdate, onShowEmojiPicker, index, sectionId, onReorderLessons } = props;
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isEditing = editingItemId === lesson.id;
    const [editedTitle, setEditedTitle] = useState(lesson.title);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const iconButtonRef = useRef<HTMLButtonElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    const [isOver, setIsOver] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setEditedTitle(lesson.title);
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        }
    }, [isEditing, lesson.title]);
    
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
        if (editedTitle.trim() && editedTitle !== lesson.title) {
            onUpdate(lesson.id, { title: editedTitle.trim() });
        }
        onSetEditing(null);
    };

    const handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        e.dataTransfer.setData('application/json', JSON.stringify({ dragIndex: index, dragSectionId: sectionId }));
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
        const data = e.dataTransfer.getData('application/json');
        if (data) {
            const { dragSectionId } = JSON.parse(data);
            if (dragSectionId === sectionId) {
                setIsOver(true);
            }
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const data = e.dataTransfer.getData('application/json');
        if (data) {
            const { dragIndex, dragSectionId } = JSON.parse(data);
            if (dragSectionId === sectionId && dragIndex !== index) {
                onReorderLessons(sectionId, dragIndex, index);
            }
        }
        setIsOver(false);
        if(itemRef.current) itemRef.current.classList.remove('opacity-30');
    };

  return (
    <div
        ref={itemRef}
        className="relative transition-opacity duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        {isOver && <div className="absolute top-[-1px] left-2 right-2 h-0.5 bg-neutral-500 dark:bg-neutral-400 z-10 rounded-full" />}
        <div 
        onClick={onSelect}
        className={`flex items-center p-2 my-1 rounded-md cursor-pointer group transition-colors ${isSelected ? 'bg-neutral-200 dark:bg-neutral-700/60 text-black dark:text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}
        >
            <div className="flex items-center flex-grow min-w-0">
                <span 
                    className="cursor-move text-neutral-500 mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <DragHandleIcon/>
                </span>
                <button ref={iconButtonRef} onClick={(e) => { e.stopPropagation(); onShowEmojiPicker({id: lesson.id, ref: iconButtonRef}) }} className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700/80">
                     {lesson.icon ? <span className="text-lg">{lesson.icon}</span> : <DocumentIcon/>}
                </button>
                {isEditing ? (
                     <input
                        ref={titleInputRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleTitleChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleTitleChange(); if (e.key === 'Escape') onSetEditing(null); }}
                        className="w-full bg-neutral-200 dark:bg-neutral-700/50 rounded-md px-2 py-0.5 text-sm ml-2 text-black dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <p className="ml-3 text-sm font-medium truncate">{lesson.title}</p>
                )}
            </div>
            <div className="relative">
                <button onClick={handleDropdownToggle} className="text-gray-500 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 ml-2 transition-opacity p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="More options">
                    <MoreIcon />
                </button>
                 {isDropdownOpen && (
                    <div ref={dropdownRef} className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#1F1F1F] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-1 z-10 origin-top-right">
                        <button onClick={(e) => { e.stopPropagation(); onSetEditing(lesson.id); setDropdownOpen(false); }} className="w-full text-left flex items-center px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                            <PencilIcon/> <span className="ml-2">Edit</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }} className="w-full text-left flex items-center px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                            <TrashIcon/> <span className="ml-2">Delete</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default LessonItem;