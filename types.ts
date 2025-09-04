

// Fix: Add global declaration for custom element 'emoji-picker'
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'emoji-picker': React.DetailedHTMLProps<import('react').HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}

export interface Lesson {
  id: string;
  title: string;
  type: string;
  icon?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'local';
  content?: string;
}

export interface Section {
  id: string;
  title:string;
  isOpen: boolean;
  icon?: string;
  lessons: Lesson[];
}

export interface Course {
  id:string;
  title: string;
  subtitle: string;
  icon?: string;
  bannerUrl?: string;
  sections: Section[];
}

export interface Settings {
  workspaceName: string;
  notifications: {
    email: boolean;
    push: boolean;
    reports: boolean;
  };
  theme: 'Dark' | 'Light' | 'System';
}

export interface Profile {
  name: string;
  email: string;
}