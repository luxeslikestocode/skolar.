import React, { useState, useRef, useEffect } from 'react';
import { type Lesson } from '../types';
import VideoPlayer from './VideoPlayer';
import { CheckIcon, CopyLinkIcon, PasteVideoIcon, UploadIcon, ImagePlaceholderIcon } from './icons';

interface MainContentProps {
  sectionTitle: string;
  lesson: Lesson;
  onUpdateLessonVideo: (lessonId: string, videoUrl: string, videoType: 'youtube' | 'local') => void;
  onUpdateLessonContent: (lessonId: string, content: string) => void;
}

const getYoutubeEmbedUrl = (url: string): string | null => {
    let videoId = null;
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        videoId = match[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const MainContent: React.FC<MainContentProps> = ({ sectionTitle, lesson, onUpdateLessonVideo, onUpdateLessonContent }) => {
  const [isPasting, setIsPasting] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [copyLinkText, setCopyLinkText] = useState('Copy link');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState(lesson.content || '');
  
  // Update local content state when lesson changes
  useEffect(() => {
      setContent(lesson.content || '');
  }, [lesson.id, lesson.content]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      onUpdateLessonVideo(lesson.id, localUrl, 'local');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handlePasteYoutubeUrl = () => {
      const embedUrl = getYoutubeEmbedUrl(youtubeUrl);
      if(embedUrl) {
          onUpdateLessonVideo(lesson.id, embedUrl, 'youtube');
          setIsPasting(false);
          setYoutubeUrl('');
      } else {
          alert("Invalid YouTube URL");
      }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        setCopyLinkText('Copied!');
        setTimeout(() => setCopyLinkText('Copy link'), 2000);
    }).catch(err => console.error('Failed to copy link: ', err));
  };

  const handleAttachmentUploadClick = () => {
      attachmentInputRef.current?.click();
  };
  
  const handleContentBlur = () => {
      if (content !== lesson.content) {
          onUpdateLessonContent(lesson.id, content);
      }
  };

  return (
    <div className="h-full flex flex-col p-8 text-neutral-700 dark:text-neutral-300 animate-fade-in">
      <div className="flex justify-end items-center mb-6">
        <button className="flex items-center text-sm bg-neutral-200 dark:bg-neutral-700/50 px-3 py-1.5 rounded-md mr-2 text-neutral-600 dark:text-current">
          <CheckIcon /> <span className="ml-2">Saved</span>
        </button>
        <button onClick={handleCopyLink} className="flex items-center text-sm border border-neutral-300 dark:border-neutral-600 px-3 py-1.5 rounded-md w-28 justify-center text-neutral-600 dark:text-current">
          <CopyLinkIcon /> <span className="ml-2">{copyLinkText}</span>
        </button>
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        <div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">{sectionTitle}</p>
            <div className="flex items-center">
                {lesson.icon && <span className="text-3xl mr-3">{lesson.icon}</span>}
                <h2 className="text-3xl font-bold text-black dark:text-white">{lesson.title}</h2>
            </div>
        </div>

        <div className="flex-grow bg-neutral-100 dark:bg-[#1a1a1a] rounded-lg mt-6 flex flex-col justify-center items-center relative min-h-[300px]">
          {lesson.videoUrl ? (
            <VideoPlayer url={lesson.videoUrl} type={lesson.videoType || 'local'} />
          ) : (
            <div className="text-center">
              <ImagePlaceholderIcon />
              <p className="mt-4 text-lg font-semibold text-black dark:text-white">Upload a video...</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Please use .mp4, .mov, .mpeg, or .webm.</p>
              <button onClick={handleUploadClick} className="mt-4 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-md flex items-center mx-auto transition-colors">
                <UploadIcon />
                <span className="ml-2">Upload file</span>
              </button>
            </div>
          )}
          {!lesson.videoUrl && (
             <div className="absolute top-4 right-4">
                <div className="grid grid-cols-1 grid-rows-1 h-10 items-center">
                    <button 
                        onClick={() => setIsPasting(true)} 
                        className={`
                            bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-400 dark:hover:bg-neutral-700 text-black dark:text-white font-semibold py-2 px-4 rounded-md flex items-center transition-all duration-300 ease-in-out col-start-1 row-start-1 justify-self-end
                            ${isPasting 
                                ? 'transform -translate-x-full opacity-0 blur-md pointer-events-none' 
                                : 'transform translate-x-0 opacity-100 blur-0'
                            }
                        `}
                        aria-hidden={isPasting}
                    >
                        <PasteVideoIcon />
                        <span className="ml-2 whitespace-nowrap">Paste Video</span>
                    </button>

                    <div className={`
                        flex items-center transition-all duration-300 ease-in-out col-start-1 row-start-1
                        ${isPasting 
                            ? 'transform translate-x-0 opacity-100 blur-0' 
                            : 'transform translate-x-full opacity-0 blur-md pointer-events-none'
                        }
                    `}>
                        <input 
                            type="text" 
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="Paste YouTube URL" 
                            className="bg-white dark:bg-neutral-900 text-black dark:text-white border border-neutral-300 dark:border-neutral-600 rounded-l-md px-3 py-2 text-sm focus:ring-neutral-500 focus:border-neutral-500 w-52 sm:w-64"
                        />
                         <button onClick={handlePasteYoutubeUrl} className="bg-neutral-800 hover:bg-black text-white dark:bg-neutral-200 dark:hover:bg-white dark:text-neutral-800 px-4 py-2 rounded-r-md text-sm font-semibold transition-colors">
                            Add
                        </button>
                        <button 
                            onClick={() => setIsPasting(false)} 
                            className="ml-2 p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex-shrink-0" 
                            aria-label="Cancel Paste URL"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
             </div>
          )}
        </div>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="video/mp4,video/quicktime,video/mpeg,video/webm"
        />
        <input
            type="file"
            ref={attachmentInputRef}
            className="hidden"
        />


        <div className="mt-8">
            <h3 className="font-semibold text-black dark:text-white mb-2 text-sm">File attachments:</h3>
            <button onClick={handleAttachmentUploadClick} className="border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white font-semibold py-2 px-4 rounded-md flex items-center text-sm transition-colors">
                <UploadIcon />
                <span className="ml-2">Upload attachment</span>
            </button>
        </div>
        <div className="mt-6 flex-grow flex flex-col">
            <h3 className="font-semibold text-black dark:text-white mb-2 text-sm">Content</h3>
            <div className="flex-grow flex flex-col bg-neutral-100 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800 min-h-[250px] relative">
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={handleContentBlur}
                    className="w-full h-full bg-transparent p-4 text-neutral-800 dark:text-neutral-300 placeholder-neutral-500 focus:outline-none resize-none rounded-lg"
                    placeholder="Add your lesson content here..."
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

export default MainContent;