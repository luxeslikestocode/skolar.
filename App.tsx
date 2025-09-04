
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { type Section, type Lesson, type Course, type Settings, type Profile } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CreateCourseModal from './components/CreateCourseModal';
import CreateLessonModal from './components/CreateLessonModal';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import { PlusIcon, MoreIcon, TrashIcon, ImageIcon, EmojiIcon, PencilIcon } from './components/icons';


const ModuleCard: React.FC<{
    course: Course,
    onClick: () => void,
    onUpdate: (id: string, updates: Partial<Course>) => void;
    onDelete: (id: string) => void;
    onShowEmojiPicker: (target: {id: string, ref: React.RefObject<HTMLElement>}) => void;
}> = ({ course, onClick, onUpdate, onDelete, onShowEmojiPicker }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const iconButtonRef = useRef<HTMLButtonElement>(null);
    const [editedTitle, setEditedTitle] = useState(course.title);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    useEffect(() => {
        if (isEditingTitle) {
            setEditedTitle(course.title);
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        }
    }, [isEditingTitle, course.title]);
    
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
        if (editedTitle.trim() && editedTitle !== course.title) {
            onUpdate(course.id, { title: editedTitle.trim() });
        }
        setIsEditingTitle(false);
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdate(course.id, { bannerUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const lessonsCount = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);

    return (
        <div className="bg-neutral-100 dark:bg-[#1F1F1F] rounded-lg group transition-all duration-300 hover:shadow-lg hover:shadow-neutral-300/50 dark:hover:shadow-neutral-600/20 text-left w-full relative animate-card-enter border border-neutral-200 dark:border-neutral-800">
            <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerChange} className="hidden" />
            <div className="relative">
                <button onClick={onClick} className="w-full h-full focus:outline-none focus:ring-2 focus:ring-neutral-500 rounded-lg">
                    <div className="aspect-video bg-neutral-200 dark:bg-neutral-900 flex items-center justify-center border-b border-neutral-200 dark:border-neutral-800 rounded-t-lg overflow-hidden">
                        {course.bannerUrl ? (
                            <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover"/>
                        ) : (
                            <div className="text-center transition-transform duration-300 group-hover:scale-105">
                                <span className="text-3xl font-bold text-neutral-800 dark:text-white">byte</span>
                                <span className="text-3xl font-bold text-neutral-800 dark:text-white">flow.</span>
                            </div>
                        )}
                    </div>
                </button>
            </div>
             <div className="p-4 pt-2">
                 <div className="flex items-center -ml-1 mb-1">
                    <button ref={iconButtonRef} onClick={(e) => { e.stopPropagation(); onShowEmojiPicker({id: course.id, ref: iconButtonRef}) }} className="transition-opacity rounded-md p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700/80">
                         {course.icon ? <span className="text-2xl">{course.icon}</span> : <div className="w-8 h-8 flex items-center justify-center"><EmojiIcon /></div>}
                    </button>
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={handleTitleChange}
                            onKeyDown={(e) => {if (e.key === 'Enter') handleTitleChange(); if (e.key === 'Escape') setIsEditingTitle(false)}}
                            className="font-semibold text-black dark:text-white bg-transparent w-full focus:outline-none bg-neutral-200 dark:bg-neutral-700/50 rounded px-1 -ml-1"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <h3 onClick={onClick} className="font-semibold text-black dark:text-white cursor-pointer w-full">{course.title}</h3>
                    )}
                 </div>
                <p onClick={onClick} className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 cursor-pointer">{course.subtitle}</p>
                <p onClick={onClick} className="text-xs text-neutral-400 dark:text-neutral-500 mt-4 cursor-pointer">{course.sections.length} chapters • {lessonsCount} lessons</p>
            </div>
            <div className="absolute top-4 right-4">
                <button onClick={handleDropdownToggle} className="text-neutral-500 hover:text-black dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="Course options">
                    <MoreIcon />
                </button>
                {isDropdownOpen && (
                    <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1F1F1F] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg py-1 z-10 origin-top-right">
                        <button onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                           <PencilIcon/> <span className="ml-2">Rename</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                           <ImageIcon/> <span className="ml-2">Change Banner</span>
                        </button>
                        <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(course.id); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/60">
                           <TrashIcon/> <span className="ml-2">Delete</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
};

const AddModuleCard: React.FC<{onClick: () => void}> = ({ onClick }) => (
    <button onClick={onClick} className="border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center text-neutral-500 hover:border-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-300 aspect-[4/3.5]">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
            <PlusIcon />
        </div>
        <span className="mt-4 font-semibold">Add module</span>
    </button>
);

const Dashboard: React.FC<{
    courses: Course[], 
    onCourseClick: (courseId: string) => void, 
    onAddCourse: () => void,
    onDeleteCourse: (courseId: string) => void;
    onUpdateCourse: (id: string, updates: Partial<Course>) => void;
    onShowEmojiPicker: (target: {id: string, ref: React.RefObject<HTMLElement>}) => void;
}> = (props) => {
    return (
        <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {props.courses.map(course => 
                    <ModuleCard 
                        key={course.id} 
                        course={course} 
                        onClick={() => props.onCourseClick(course.id)} 
                        onDelete={props.onDeleteCourse}
                        onUpdate={props.onUpdateCourse}
                        onShowEmojiPicker={props.onShowEmojiPicker}
                    />
                )}
                <AddModuleCard onClick={props.onAddCourse} />
            </div>
        </div>
    );
};

const EmojiPicker: React.FC<{ 
    target: {id: string, ref: React.RefObject<HTMLElement>} | null,
    onEmojiSelect: (id: string, emoji: string) => void,
    onClose: () => void,
    theme: Settings['theme']
}> = ({ target, onEmojiSelect, onClose, theme }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !target) return;

        const picker = container.querySelector('emoji-picker');
        if (!picker) return;

        const handleEmojiClick = (event: any) => {
            onEmojiSelect(target.id, event.detail.unicode);
            onClose();
        };
        picker.addEventListener('emoji-click', handleEmojiClick);

        const handleClickOutside = (event: MouseEvent) => {
            if (container && !container.contains(event.target as Node) && !target.ref.current?.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            picker.removeEventListener('emoji-click', handleEmojiClick);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [target, onEmojiSelect, onClose]);

    if (!target) return null;

    const rect = target.ref.current?.getBoundingClientRect();

    return (
        <div ref={containerRef} className="absolute z-50" style={{ top: rect ? rect.bottom + 8 : 0, left: rect ? rect.left : 0 }}>
             <emoji-picker className={theme === 'Light' ? 'light' : 'dark'}></emoji-picker>
        </div>
    );
};


const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'editor' | 'profile' | 'settings'>('dashboard');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [emojiPickerTarget, setEmojiPickerTarget] = useState<{ id: string, ref: React.RefObject<HTMLElement> } | null>(null);
  const [createLessonInfo, setCreateLessonInfo] = useState<{ sectionId: string } | null>(null);
  const [newLessonIcon, setNewLessonIcon] = useState('📄');
  const [settings, setSettings] = useState<Settings>({
    workspaceName: "byteflow's Workspace",
    notifications: {
      email: true,
      push: true,
      reports: false,
    },
    theme: 'Dark',
  });
   const [profile, setProfile] = useState<Profile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
        if (settings.theme === 'System') {
            if (mediaQuery.matches) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else if (settings.theme === 'Dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    applyTheme();

    mediaQuery.addEventListener('change', applyTheme);
    return () => {
        mediaQuery.removeEventListener('change', applyTheme);
    };
}, [settings.theme]);


  const selectedCourse = courses.find(c => c.id === selectedCourseId) || null;

  const handleUpdateItem = useCallback((itemId: string, updates: Partial<Course | Section | Lesson>) => {
      setCourses(prevCourses => {
          const newCourses = JSON.parse(JSON.stringify(prevCourses));
          for (const course of newCourses) {
              if (course.id === itemId) { Object.assign(course, updates); return newCourses; }
              for (const section of course.sections) {
                  if (section.id === itemId) { Object.assign(section, updates); return newCourses; }
                  for (const lesson of section.lessons) {
                      if (lesson.id === itemId) { Object.assign(lesson, updates); return newCourses; }
                  }
              }
          }
          return prevCourses;
      });
  }, []);

  const handleUpdateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const handleUpdateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);


  const handleSelectLesson = useCallback((lessonId: string) => {
    setSelectedLessonId(lessonId);
  }, []);
  
  const handleCourseClick = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveView('editor');
    const course = courses.find(c => c.id === courseId);
    if (course && course.sections.length > 0 && course.sections[0].lessons.length > 0) {
        setSelectedLessonId(course.sections[0].lessons[0].id);
    } else {
        setSelectedLessonId(null);
    }
  }, [courses]);

  const handleCreateCourse = useCallback((title: string) => {
    const newCourse: Course = {
        id: `course-${Date.now()}`,
        title,
        subtitle: 'Course module',
        sections: [],
        icon: '📚'
    };
    setCourses(prevCourses => [...prevCourses, newCourse]);
    setCreateModalOpen(false);
  }, []);

  const handleDeleteCourse = useCallback((courseId: string) => {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      if (selectedCourseId === courseId) {
          setSelectedCourseId(null);
          setActiveView('dashboard');
      }
  }, [selectedCourseId]);

  const handleNavigate = useCallback((view: 'dashboard' | 'editor' | 'profile' | 'settings') => {
      if (view === 'dashboard') {
          setSelectedCourseId(null);
          setSelectedLessonId(null);
      }
      setActiveView(view);
  }, []);
  
  const handleAddSection = useCallback((title: string) => {
    if (!selectedCourseId) return;
    const newSection: Section = {
        id: `sec-${Date.now()}`,
        title: title || 'New Section',
        isOpen: true,
        lessons: [],
        icon: '📑'
    };
    setCourses(prev => prev.map(course => 
        course.id === selectedCourseId 
            ? { ...course, sections: [...course.sections, newSection] } 
            : course
    ));
  }, [selectedCourseId]);

  const handleToggleSection = useCallback((sectionId: string) => {
    if (!selectedCourseId) return;
    setCourses(prev => prev.map(course => 
        course.id === selectedCourseId
            ? { ...course, sections: course.sections.map(s => s.id === sectionId ? {...s, isOpen: !s.isOpen} : s) }
            : course
    ));
  }, [selectedCourseId]);

  const handleAddLesson = useCallback((sectionId: string) => {
      setNewLessonIcon('📄'); // Reset to default
      setCreateLessonInfo({ sectionId });
  }, []);
  
  const handleCreateLesson = useCallback((title: string, icon: string) => {
    if (!selectedCourseId || !createLessonInfo) return;

    const newLesson: Lesson = {
        id: `les-${createLessonInfo.sectionId}-${Date.now()}`,
        title,
        type: 'lesson',
        icon,
        content: ''
    };

    setCourses(prev => prev.map(course =>
        course.id === selectedCourseId
            ? { ...course, sections: course.sections.map(s => s.id === createLessonInfo.sectionId ? {...s, lessons: [...s.lessons, newLesson]} : s) }
            : course
    ));

    setSelectedLessonId(newLesson.id);
    setCreateLessonInfo(null);
  }, [selectedCourseId, createLessonInfo]);


  const handleDeleteSection = useCallback((sectionId: string) => {
    if (!selectedCourseId) return;
      setCourses(prev => prev.map(course =>
        course.id === selectedCourseId
            ? { ...course, sections: course.sections.filter(s => s.id !== sectionId) }
            : course
      ));
  }, [selectedCourseId]);
  
  const handleDeleteLesson = useCallback((lessonId: string) => {
    if (!selectedCourseId) return;
      setCourses(prev => prev.map(course =>
        course.id === selectedCourseId
            ? { ...course, sections: course.sections.map(s => ({...s, lessons: s.lessons.filter(l => l.id !== lessonId)})) }
            : course
      ));
      if (selectedLessonId === lessonId) {
          setSelectedLessonId(null);
      }
  }, [selectedCourseId, selectedLessonId]);

  const handleUpdateLessonVideo = useCallback((lessonId: string, videoUrl: string, videoType: 'youtube' | 'local') => {
    handleUpdateItem(lessonId, { videoUrl, videoType });
  }, [handleUpdateItem]);

  const handleUpdateLessonContent = useCallback((lessonId: string, content: string) => {
    handleUpdateItem(lessonId, { content });
  }, [handleUpdateItem]);
  
  const handleEmojiSelect = (id: string, emoji: string) => {
      if (id === 'new-lesson-icon-target') {
          setNewLessonIcon(emoji);
      } else {
          handleUpdateItem(id, { icon: emoji });
      }
  };

  const handleReorderSections = useCallback((dragIndex: number, hoverIndex: number) => {
    if (!selectedCourseId) return;
    setCourses(prev => prev.map(course => {
        if (course.id === selectedCourseId) {
            const reorderedSections = [...course.sections];
            const [movedItem] = reorderedSections.splice(dragIndex, 1);
            reorderedSections.splice(hoverIndex, 0, movedItem);
            return { ...course, sections: reorderedSections };
        }
        return course;
    }));
  }, [selectedCourseId]);

  const handleReorderLessons = useCallback((sectionId: string, dragIndex: number, hoverIndex: number) => {
    if (!selectedCourseId) return;
    setCourses(prev => prev.map(course => {
        if (course.id === selectedCourseId) {
            const newSections = course.sections.map(section => {
                if (section.id === sectionId) {
                    const reorderedLessons = [...section.lessons];
                    const [movedItem] = reorderedLessons.splice(dragIndex, 1);
                    reorderedLessons.splice(hoverIndex, 0, movedItem);
                    return { ...section, lessons: reorderedLessons };
                }
                return section;
            });
            return { ...course, sections: newSections };
        }
        return course;
    }));
}, [selectedCourseId]);

  const selectedLesson = selectedCourse?.sections.flatMap(s => s.lessons).find(l => l.id === selectedLessonId) || null;
  const selectedSection = selectedCourse?.sections.find(s => s.lessons.some(l => l.id === selectedLessonId)) || null;

  const renderContent = () => {
      switch (activeView) {
          case 'dashboard':
              return <Dashboard
                  courses={courses}
                  onCourseClick={handleCourseClick}
                  onAddCourse={() => setCreateModalOpen(true)}
                  onDeleteCourse={handleDeleteCourse}
                  onUpdateCourse={handleUpdateItem}
                  onShowEmojiPicker={setEmojiPickerTarget}
              />;
          case 'editor':
              if (selectedLesson && selectedSection) {
                  return <MainContent
                      sectionTitle={selectedSection.title}
                      lesson={selectedLesson}
                      onUpdateLessonVideo={handleUpdateLessonVideo}
                      onUpdateLessonContent={handleUpdateLessonContent}
                  />;
              }
              return <div className="flex h-full items-center justify-center text-neutral-500">
                  <p>Select a lesson to begin or create a new one.</p>
              </div>;
          case 'profile':
              return <ProfilePage profile={profile} onUpdateProfile={handleUpdateProfile} />;
          case 'settings':
              return <SettingsPage settings={settings} onUpdateSettings={handleUpdateSettings} />;
          default:
              return null;
      }
  }

  return (
    <div className="bg-white dark:bg-[#0D0D0D] text-gray-800 dark:text-gray-300 min-h-screen flex">
      <Sidebar
        sections={selectedCourse?.sections || []}
        selectedLessonId={selectedLessonId}
        activeView={activeView}
        onSelectLesson={handleSelectLesson}
        onToggleSection={handleToggleSection}
        onAddLesson={handleAddLesson}
        onAddSection={handleAddSection}
        onDeleteSection={handleDeleteSection}
        onDeleteLesson={handleDeleteLesson}
        onNavigate={handleNavigate}
        editingItemId={editingItemId}
        onSetEditing={setEditingItemId}
        onUpdate={handleUpdateItem}
        onShowEmojiPicker={setEmojiPickerTarget}
        onReorderSections={handleReorderSections}
        onReorderLessons={handleReorderLessons}
      />
      <div className="flex-1 flex flex-col h-screen">
          <Header activeView={activeView} onNavigate={handleNavigate} />
          <main className="flex-1 overflow-y-auto">
              {renderContent()}
          </main>
      </div>
      {isCreateModalOpen && <CreateCourseModal onCreate={handleCreateCourse} onClose={() => setCreateModalOpen(false)} />}
      {createLessonInfo && <CreateLessonModal onCreate={handleCreateLesson} onClose={() => setCreateLessonInfo(null)} onShowEmojiPicker={setEmojiPickerTarget} selectedIcon={newLessonIcon} />}
      <EmojiPicker target={emojiPickerTarget} onEmojiSelect={handleEmojiSelect} onClose={() => setEmojiPickerTarget(null)} theme={settings.theme} />
    </div>
  );
};

export default App;
