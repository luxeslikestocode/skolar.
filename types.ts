
export interface Lesson {
  id: string;
  title: string;
  type: string;
  icon?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'local';
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
