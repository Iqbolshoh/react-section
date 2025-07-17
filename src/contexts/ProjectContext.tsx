import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, SectionInstance, SectionTemplate, Page } from '../types';
import { generateId } from '../utils/helpers';
import { optimizedStorage } from '../utils/optimizedStorage';
import { improvedSectionTemplates, getSectionTemplateById } from '../data/improvedSectionTemplates';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  currentPage: Page | null;
  sectionTemplates: SectionTemplate[];
  createProject: (name: string, description?: string, websiteUrl?: string, category?: string, seoKeywords?: string[], logo?: string, favicon?: string) => Project;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  setCurrentPage: (page: Page | null) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  
  // Page management
  createPage: (projectId: string, name: string, slug: string, title: string) => Page;
  updatePage: (projectId: string, pageId: string, updates: Partial<Page>) => void;
  deletePage: (projectId: string, pageId: string) => void;
  reorderPages: (projectId: string, pages: Page[]) => void;
  duplicatePage: (projectId: string, pageId: string) => void;
  
  // Section management (now page-specific)
  addSectionFromTemplate: (templateId: string, customData?: any, insertPosition?: { index: number; position: 'above' | 'below' } | null) => void;
  updateSectionData: (sectionId: string, data: any) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (sections: SectionInstance[]) => void;
  duplicateSection: (sectionId: string) => void;
  
  getSectionTemplate: (templateId: string) => SectionTemplate | undefined;
  clearAllData: () => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [sectionTemplates] = useState<SectionTemplate[]>(improvedSectionTemplates);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from optimized storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔄 Loading projects from optimized storage...');
        
        // Load projects from optimized storage
        const savedProjects = optimizedStorage.getAllProjects();
        
        // Migrate old projects to new page structure
        const migratedProjects = savedProjects.map(project => migrateProjectToPages(project));
        
        console.log('✅ Loaded and migrated projects:', migratedProjects);
        setProjects(migratedProjects);

        // Initialize section templates in storage if not present
        const existingTemplates = optimizedStorage.getSectionTemplates();
        if (existingTemplates.length === 0) {
          console.log('📝 Initializing section templates in storage...');
          improvedSectionTemplates.forEach(template => {
            optimizedStorage.saveSectionTemplate(template);
          });
        }
        
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-save projects whenever they change (but not on initial load)
  useEffect(() => {
    if (!isLoading) {
      console.log('💾 Auto-saving projects to optimized storage...');
      // Save each project individually
      projects.forEach(project => {
        optimizedStorage.saveProject(project);
      });
    }
  }, [projects, isLoading]);

  // Migration function to convert old projects to new page structure
  const migrateProjectToPages = (project: any): Project => {
    // If project already has pages, return as is
    if (project.pages && Array.isArray(project.pages)) {
      return project;
    }

    // If project has old sections structure, migrate to pages
    const homePage: Page = {
      id: generateId(),
      name: 'Home',
      slug: 'home',
      title: project.name || 'Home',
      description: project.description,
      sections: project.sections || [],
      isHomePage: true,
      isPublished: true,
      order: 0,
      createdAt: project.createdAt || new Date(),
      updatedAt: new Date(),
    };

    return {
      ...project,
      pages: [homePage],
      // Remove old sections property
      sections: undefined,
    };
  };

  const createProject = (
    name: string, 
    description?: string, 
    websiteUrl?: string, 
    category?: string, 
    seoKeywords?: string[], 
    logo?: string, 
    favicon?: string
  ): Project => {
    const projectId = generateId();
    const cleanWebsiteUrl = websiteUrl || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    
    // Create default home page
    const homePage: Page = {
      id: generateId(),
      name: 'Home',
      slug: 'home',
      title: name,
      description: description,
      sections: [],
      isHomePage: true,
      isPublished: true,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const newProject: Project = {
      id: projectId,
      name: name.trim(),
      description: description?.trim(),
      websiteUrl: cleanWebsiteUrl,
      category: category || 'business',
      seoKeywords: seoKeywords || [],
      logo: logo || '',
      favicon: favicon || '',
      pages: [homePage],
      themeId: 'modern-blue',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      thumbnail: generateProjectThumbnail(),
    };

    console.log('🆕 Creating new project:', newProject);

    // Save to optimized storage immediately
    optimizedStorage.saveProject(newProject);
    
    // Update local state
    setProjects(prev => [newProject, ...prev]);
    
    console.log('✅ Project created and saved:', newProject);
    return newProject;
  };

  const deleteProject = (id: string) => {
    console.log('🗑️ Deleting project:', id);
    
    // Remove from optimized storage
    optimizedStorage.deleteProject(id);
    
    // Update local state
    setProjects(prev => prev.filter(p => p.id !== id));
    
    // Clear current project if it's the one being deleted
    if (currentProject?.id === id) {
      setCurrentProject(null);
      setCurrentPage(null);
    }
    
    console.log('✅ Project deleted successfully');
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    console.log('📝 Updating project:', projectId, updates);
    
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const updatedProject = { 
          ...project, 
          ...updates, 
          updatedAt: new Date() 
        };
        
        // Save to optimized storage
        optimizedStorage.saveProject(updatedProject);
        
        // Update current project if it's the one being updated
        if (currentProject?.id === projectId) {
          setCurrentProject(updatedProject);
        }
        
        console.log('✅ Project updated:', updatedProject);
        return updatedProject;
      }
      return project;
    }));
  };

  // Page Management Functions
  const createPage = (projectId: string, name: string, slug: string, title: string): Page => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const newPage: Page = {
      id: generateId(),
      name: name.trim(),
      slug: slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, ''),
      title: title.trim(),
      sections: [],
      isHomePage: false,
      isPublished: false,
      order: project.pages.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedPages = [...project.pages, newPage];
    updateProject(projectId, { pages: updatedPages });

    console.log('✅ Created new page:', newPage);
    return newPage;
  };

  const updatePage = (projectId: string, pageId: string, updates: Partial<Page>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedPages = project.pages.map(page => {
      if (page.id === pageId) {
        const updatedPage = { ...page, ...updates, updatedAt: new Date() };
        
        // Update current page if it's the one being updated
        if (currentPage?.id === pageId) {
          setCurrentPage(updatedPage);
        }
        
        return updatedPage;
      }
      return page;
    });

    updateProject(projectId, { pages: updatedPages });
    console.log('✅ Updated page:', pageId, updates);
  };

  const deletePage = (projectId: string, pageId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Don't allow deleting the home page
    const pageToDelete = project.pages.find(p => p.id === pageId);
    if (pageToDelete?.isHomePage) {
      alert('Cannot delete the home page');
      return;
    }

    const updatedPages = project.pages
      .filter(page => page.id !== pageId)
      .map((page, index) => ({ ...page, order: index }));

    updateProject(projectId, { pages: updatedPages });

    // Clear current page if it's the one being deleted
    if (currentPage?.id === pageId) {
      setCurrentPage(project.pages.find(p => p.isHomePage) || null);
    }

    console.log('✅ Deleted page:', pageId);
  };

  const reorderPages = (projectId: string, pages: Page[]) => {
    const reorderedPages = pages.map((page, index) => ({
      ...page,
      order: index,
      updatedAt: new Date(),
    }));
    
    updateProject(projectId, { pages: reorderedPages });
    console.log('🔄 Reordered pages');
  };

  const duplicatePage = (projectId: string, pageId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const pageToDuplicate = project.pages.find(p => p.id === pageId);
    if (!pageToDuplicate) return;

    const duplicatedPage: Page = {
      ...pageToDuplicate,
      id: generateId(),
      name: `${pageToDuplicate.name} (Copy)`,
      slug: `${pageToDuplicate.slug}-copy-${Date.now()}`,
      title: `${pageToDuplicate.title} (Copy)`,
      isHomePage: false,
      order: project.pages.length,
      sections: pageToDuplicate.sections.map(section => ({
        ...section,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedPages = [...project.pages, duplicatedPage];
    updateProject(projectId, { pages: updatedPages });

    console.log('📋 Duplicated page:', pageId);
  };

  // Section Management Functions (now page-specific)
  const addSectionFromTemplate = (templateId: string, customData?: any, insertPosition?: { index: number; position: 'above' | 'below' } | null) => {
    if (!currentProject || !currentPage) {
      console.warn('⚠️ No current project or page selected');
      return;
    }

    const template = getSectionTemplateById(templateId);
    if (!template) {
      console.error('❌ Template not found:', templateId);
      return;
    }

    let newOrder: number;
    let updatedSections = [...currentPage.sections];

    if (insertPosition) {
      const targetIndex = insertPosition.position === 'above' ? insertPosition.index : insertPosition.index + 1;
      newOrder = targetIndex;
      
      updatedSections = updatedSections.map(section => ({
        ...section,
        order: section.order >= targetIndex ? section.order + 1 : section.order
      }));
    } else {
      newOrder = currentPage.sections.length;
    }

    const newSection: SectionInstance = {
      id: generateId(),
      templateId,
      data: customData || template.defaultContent,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    updatedSections.push(newSection);
    updatePage(currentProject.id, currentPage.id, { sections: updatedSections });
    
    console.log('✅ Added section from template:', { 
      templateId, 
      section: newSection, 
      insertPosition: insertPosition || 'end' 
    });
  };

  const updateSectionData = (sectionId: string, data: any) => {
    if (!currentProject || !currentPage) return;

    const updatedSections = currentPage.sections.map(section => {
      if (section.id === sectionId) {
        const updatedSection = { ...section, data, updatedAt: new Date() };
        console.log('📝 Updated section data:', { sectionId, data });
        return updatedSection;
      }
      return section;
    });

    updatePage(currentProject.id, currentPage.id, { sections: updatedSections });
  };

  const deleteSection = (sectionId: string) => {
    if (!currentProject || !currentPage) return;

    const updatedSections = currentPage.sections
      .filter(section => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));

    updatePage(currentProject.id, currentPage.id, { sections: updatedSections });
    console.log('🗑️ Deleted section:', sectionId);
  };

  const reorderSections = (sections: SectionInstance[]) => {
    if (!currentProject || !currentPage) return;
    
    const reorderedSections = sections.map((section, index) => ({
      ...section,
      order: index,
      updatedAt: new Date(),
    }));
    
    updatePage(currentProject.id, currentPage.id, { sections: reorderedSections });
    console.log('🔄 Reordered sections');
  };

  const duplicateSection = (sectionId: string) => {
    if (!currentProject || !currentPage) return;

    const sectionToDuplicate = currentPage.sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const newSection: SectionInstance = {
      ...sectionToDuplicate,
      id: generateId(),
      order: sectionToDuplicate.order + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSections = [
      ...currentPage.sections.slice(0, sectionToDuplicate.order + 1),
      newSection,
      ...currentPage.sections.slice(sectionToDuplicate.order + 1).map(s => ({ ...s, order: s.order + 1 })),
    ];

    updatePage(currentProject.id, currentPage.id, { sections: updatedSections });
    console.log('📋 Duplicated section:', sectionId);
  };

  const getSectionTemplate = (templateId: string): SectionTemplate | undefined => {
    return getSectionTemplateById(templateId);
  };

  const clearAllData = () => {
    console.log('🧹 Clearing all data...');
    
    // Clear from optimized storage
    const allProjects = optimizedStorage.getAllProjects();
    allProjects.forEach(project => {
      optimizedStorage.deleteProject(project.id);
    });
    
    // Clear local state
    setProjects([]);
    setCurrentProject(null);
    setCurrentPage(null);
    
    console.log('✅ All data cleared successfully');
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      currentPage,
      sectionTemplates,
      createProject,
      deleteProject,
      setCurrentProject,
      setCurrentPage,
      updateProject,
      createPage,
      updatePage,
      deletePage,
      reorderPages,
      duplicatePage,
      addSectionFromTemplate,
      updateSectionData,
      deleteSection,
      reorderSections,
      duplicateSection,
      getSectionTemplate,
      clearAllData,
      isLoading,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

const generateProjectThumbnail = (): string => {
  const thumbnails = [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
  ];
  return thumbnails[Math.floor(Math.random() * thumbnails.length)];
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};