export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    primary100: string;
    primary200: string;
    primary300: string;
    secondary100: string;
    secondary200: string;
    accent100: string;
    accent200: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    accent: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface SectionTemplate {
  id: string;
  name: string;
  category: string;
  type: string;
  thumbnail: string;
  description: string;
  defaultContent: any;
  icon: string;
  tags: string[];
}

export interface SectionInstance {
  id: string;
  templateId: string;
  data: any;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  websiteUrl: string; // New field for custom website URL
  category: string; // Website category (business, personal, etc.)
  seoKeywords: string[]; // SEO keywords array
  logo?: string; // Logo URL
  favicon?: string; // Favicon URL
  sections: SectionInstance[];
  themeId: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  publishUrl?: string;
  thumbnail?: string;
}

export interface Section {
  id: string;
  type: string;
  category: string;
  content: any;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageData {
  projects: Project[];
  sectionTemplates: SectionTemplate[];
  lastUpdated: Date;
}